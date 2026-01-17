import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  getMint
} from '@solana/spl-token';

/**
 * x402 Payment Protocol Implementation
 * Supports multiple facilitators and chains
 */

export interface X402PaymentRequest {
  chain: string;
  token: string;
  amount: string;
  recipient: string;
  facilitator: string;
  customTokenAddress?: string;
}

export interface X402PaymentResponse {
  success: boolean;
  txHash?: string;
  error?: string;
  paymentId?: string;
}

export interface X402Facilitator {
  id: string;
  name: string;
  endpoint: string;
  verifyEndpoint: string;
  settleEndpoint: string;
  chains: string[];
}

// Facilitator configurations
export const X402_FACILITATORS: Record<string, X402Facilitator> = {
  payai: {
    id: 'payai',
    name: 'PayAI',
    endpoint: 'https://facilitator.payai.io',
    verifyEndpoint: 'https://facilitator.payai.io/verify',
    settleEndpoint: 'https://facilitator.payai.io/settle',
    chains: ['solana', 'base', 'polygon', 'avalanche', 'sei', 'peaq', 'iotex'],
  },
  coinbase: {
    id: 'coinbase',
    name: 'Coinbase CDP',
    endpoint: 'https://facilitator.cdp.coinbase.com',
    verifyEndpoint: 'https://facilitator.cdp.coinbase.com/verify',
    settleEndpoint: 'https://facilitator.cdp.coinbase.com/settle',
    chains: ['base'],
  },
  x402rs: {
    id: 'x402rs',
    name: 'x402.rs',
    endpoint: 'https://facilitator.x402.rs',
    verifyEndpoint: 'https://facilitator.x402.rs/verify',
    settleEndpoint: 'https://facilitator.x402.rs/settle',
    chains: ['base', 'xdc'],
  },
};

/**
 * Create x402 payment request
 */
export async function createX402PaymentRequest(
  request: X402PaymentRequest
): Promise<{ paymentId: string; paymentUrl: string }> {
  const facilitator = X402_FACILITATORS[request.facilitator];
  
  if (!facilitator) {
    throw new Error(`Unknown facilitator: ${request.facilitator}`);
  }

  if (!facilitator.chains.includes(request.chain)) {
    throw new Error(`Facilitator ${facilitator.name} does not support chain ${request.chain}`);
  }

  // Generate unique payment ID
  const paymentId = `x402_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // Create payment URL with x402 protocol parameters
  const paymentUrl = `${facilitator.endpoint}/pay?${new URLSearchParams({
    id: paymentId,
    chain: request.chain,
    token: request.customTokenAddress || request.token,
    amount: request.amount,
    recipient: request.recipient,
    protocol: 'x402',
  }).toString()}`;

  return { paymentId, paymentUrl };
}

/**
 * Send Solana payment via x402
 */
export async function sendSolanaX402Payment(
  connection: Connection,
  payerPublicKey: PublicKey,
  recipientAddress: string,
  amount: number,
  tokenMint?: string,
  signTransaction?: (tx: Transaction) => Promise<Transaction>
): Promise<X402PaymentResponse> {
  try {
    if (!signTransaction) {
      throw new Error('Wallet not connected or does not support signing');
    }

    const recipientPublicKey = new PublicKey(recipientAddress);
    const transaction = new Transaction();

    if (tokenMint) {
      // SPL Token transfer
      const mintPublicKey = new PublicKey(tokenMint);
      
      // Get or create associated token accounts
      const payerTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        payerPublicKey
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey
      );

      // Check if recipient token account exists
      const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
      
      if (!recipientAccountInfo) {
        // Create associated token account for recipient
        transaction.add(
          createAssociatedTokenAccountInstruction(
            payerPublicKey,
            recipientTokenAccount,
            recipientPublicKey,
            mintPublicKey
          )
        );
      }

      // Add transfer instruction
      const mintInfo = await getMint(connection, mintPublicKey);
      const decimals = mintInfo.decimals;
      const adjustedAmount = amount * Math.pow(10, decimals);

      transaction.add(
        createTransferInstruction(
          payerTokenAccount,
          recipientTokenAccount,
          payerPublicKey,
          adjustedAmount
        )
      );
    } else {
      // Native SOL transfer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payerPublicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    }

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payerPublicKey;

    // Sign transaction
    const signedTransaction = await signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // Confirm transaction
    await connection.confirmTransaction(signature, 'confirmed');

    return {
      success: true,
      txHash: signature,
      paymentId: `sol_${signature}`,
    };
  } catch (error) {
    console.error('Solana x402 payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify x402 payment with facilitator
 */
export async function verifyX402Payment(
  facilitatorId: string,
  paymentId: string,
  txHash: string,
  chain: string
): Promise<{ verified: boolean; error?: string }> {
  const facilitator = X402_FACILITATORS[facilitatorId];
  
  if (!facilitator) {
    return { verified: false, error: 'Unknown facilitator' };
  }

  try {
    const response = await fetch(facilitator.verifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        txHash,
        chain,
        protocol: 'x402',
      }),
    });

    if (!response.ok) {
      throw new Error(`Verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { verified: data.verified || false };
  } catch (error) {
    console.error('x402 verification error:', error);
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Settle x402 payment with facilitator
 */
export async function settleX402Payment(
  facilitatorId: string,
  paymentId: string,
  txHash: string
): Promise<{ settled: boolean; error?: string }> {
  const facilitator = X402_FACILITATORS[facilitatorId];
  
  if (!facilitator) {
    return { settled: false, error: 'Unknown facilitator' };
  }

  try {
    const response = await fetch(facilitator.settleEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        txHash,
        protocol: 'x402',
      }),
    });

    if (!response.ok) {
      throw new Error(`Settlement failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { settled: data.settled || false };
  } catch (error) {
    console.error('x402 settlement error:', error);
    return {
      settled: false,
      error: error instanceof Error ? error.message : 'Settlement failed',
    };
  }
}

/**
 * Parse x402 payment link
 */
export function parseX402PaymentLink(url: string): X402PaymentRequest | null {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    const chain = params.get('chain');
    const token = params.get('token');
    const amount = params.get('amount');
    const recipient = params.get('recipient');

    if (!chain || !token || !amount || !recipient) {
      return null;
    }

    // Determine facilitator from URL
    let facilitator = 'payai';
    if (url.includes('cdp.coinbase.com')) {
      facilitator = 'coinbase';
    } else if (url.includes('x402.rs')) {
      facilitator = 'x402rs';
    }

    return {
      chain,
      token,
      amount,
      recipient,
      facilitator,
    };
  } catch (error) {
    console.error('Error parsing x402 payment link:', error);
    return null;
  }
}

/**
 * Format amount for display
 */
export function formatX402Amount(amount: string, decimals: number = 6): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  return num.toFixed(decimals);
}

/**
 * Validate address for chain
 */
export function validateAddress(address: string, chain: string): boolean {
  try {
    if (chain === 'solana') {
      new PublicKey(address);
      return true;
    } else {
      // EVM chains - basic validation
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
  } catch {
    return false;
  }
}
