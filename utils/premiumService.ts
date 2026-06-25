import { supabase } from './supabase';
import type { PremiumAnalysis, PremiumPayment } from '../types';

// ─── HELPERS: DB row ↔ Frontend type ─────────────────────────────────────────

function rowToAnalysis(row: any): PremiumAnalysis {
  return {
    id: row.id,
    matchName: row.match_name,
    league: row.league || '',
    matchDate: row.match_date || '',
    prediction: row.prediction,
    odd: parseFloat(row.odd) || 0,
    confidence: row.confidence || 0,
    analysisText: row.analysis_text || '',
    isGuaranteed: row.is_guaranteed || false,
    price: parseFloat(row.price) || 0,
    status: row.status || 'pending',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToPayment(row: any): PremiumPayment {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username || '',
    analysisId: row.analysis_id,
    amount: parseFloat(row.amount) || 0,
    method: row.method,
    txReference: row.tx_reference || '',
    status: row.status || 'pending',
    refundReason: row.refund_reason,
    createdAt: row.created_at,
    processedAt: row.processed_at,
  };
}

// ─── ANALYSES ────────────────────────────────────────────────────────────────

export async function fetchPremiumAnalyses(): Promise<PremiumAnalysis[]> {
  const { data, error } = await supabase
    .from('premium_analyses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching premium analyses:', error);
    return [];
  }
  return (data || []).map(rowToAnalysis);
}

export async function createPremiumAnalysis(analysis: Omit<PremiumAnalysis, 'id' | 'createdAt' | 'updatedAt'>): Promise<PremiumAnalysis | null> {
  const { data, error } = await supabase
    .from('premium_analyses')
    .insert({
      match_name: analysis.matchName,
      league: analysis.league,
      match_date: analysis.matchDate || null,
      prediction: analysis.prediction,
      odd: analysis.odd,
      confidence: analysis.confidence,
      analysis_text: analysis.analysisText,
      is_guaranteed: analysis.isGuaranteed,
      price: analysis.price,
      status: analysis.status || 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating premium analysis:', error);
    return null;
  }
  return rowToAnalysis(data);
}

export async function updateAnalysisStatus(id: string, status: PremiumAnalysis['status']): Promise<boolean> {
  const { error } = await supabase
    .from('premium_analyses')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating analysis status:', error);
    return false;
  }

  // If status is 'lost', trigger refund for guaranteed analyses
  if (status === 'lost') {
    await processRefundForAnalysis(id);
  }

  return true;
}

export async function deletePremiumAnalysis(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('premium_analyses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting premium analysis:', error);
    return false;
  }
  return true;
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export async function createPayment(payment: {
  userId: string;
  username: string;
  analysisId: string;
  amount: number;
  method: 'usdt' | 'bank_transfer';
  txReference: string;
}): Promise<PremiumPayment | null> {
  const { data, error } = await supabase
    .from('premium_payments')
    .insert({
      user_id: payment.userId,
      username: payment.username,
      analysis_id: payment.analysisId,
      amount: payment.amount,
      method: payment.method,
      tx_reference: payment.txReference,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    return null;
  }
  return rowToPayment(data);
}

export async function fetchPayments(): Promise<PremiumPayment[]> {
  const { data, error } = await supabase
    .from('premium_payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    return [];
  }
  return (data || []).map(rowToPayment);
}

export async function confirmPayment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('premium_payments')
    .update({ status: 'confirmed', processed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error confirming payment:', error);
    return false;
  }
  return true;
}

export async function rejectPayment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('premium_payments')
    .update({ status: 'rejected', processed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error rejecting payment:', error);
    return false;
  }
  return true;
}

// ─── REFUND LOGIC ────────────────────────────────────────────────────────────

async function processRefundForAnalysis(analysisId: string): Promise<void> {
  // 1. Check if analysis is guaranteed
  const { data: analysis } = await supabase
    .from('premium_analyses')
    .select('is_guaranteed, price')
    .eq('id', analysisId)
    .single();

  if (!analysis?.is_guaranteed) return;

  // 2. Find all confirmed payments for this analysis
  const { data: payments } = await supabase
    .from('premium_payments')
    .select('id, user_id, username, amount')
    .eq('analysis_id', analysisId)
    .eq('status', 'confirmed');

  if (!payments || payments.length === 0) return;

  // 3. Refund each payment
  for (const payment of payments) {
    // Add to user balance
    const { data: existing } = await supabase
      .from('user_balances')
      .select('site_balance')
      .eq('user_id', payment.user_id)
      .single();

    if (existing) {
      await supabase
        .from('user_balances')
        .update({
          site_balance: (parseFloat(existing.site_balance) || 0) + parseFloat(payment.amount),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', payment.user_id);
    } else {
      await supabase
        .from('user_balances')
        .insert({
          user_id: payment.user_id,
          username: payment.username,
          site_balance: parseFloat(payment.amount),
          updated_at: new Date().toISOString(),
        });
    }

    // Mark payment as refunded
    await supabase
      .from('premium_payments')
      .update({
        status: 'refunded',
        refund_reason: 'Garantili analiz kaybetti — otomatik iade',
        processed_at: new Date().toISOString(),
      })
      .eq('id', payment.id);
  }
}
