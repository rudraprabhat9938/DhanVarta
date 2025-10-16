import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scenario } = await req.json();
    console.log('Analyzing scenario:', scenario);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    let userId: string | null = null;

    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    const systemPrompt = `You are a financial analyst specializing in currency market scenarios. 
    
Analyze the given scenario and provide:
1. Potential outcome (best case, worst case, most likely)
2. Probability assessment
3. Key risk factors
4. Recommended actions

Return your analysis as a JSON object with these exact fields:
{
  "bestCase": "description",
  "worstCase": "description",
  "mostLikely": "description",
  "probability": "percentage",
  "riskFactors": ["factor1", "factor2", "factor3"],
  "recommendations": ["action1", "action2", "action3"]
}`;

    const userPrompt = `Analyze this currency scenario:
Amount: ${scenario.amount} ${scenario.fromCurrency}
Target Currency: ${scenario.toCurrency}
Time Horizon: ${scenario.timeHorizon}
Market Scenario: ${scenario.marketScenario}`;

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0]?.message?.content || '{}');

    // Store scenario if user is authenticated
    if (userId) {
      await supabase.from('what_if_scenarios').insert({
        user_id: userId,
        scenario_name: `${scenario.fromCurrency} to ${scenario.toCurrency} - ${scenario.marketScenario}`,
        scenario_data: scenario,
        results: analysis,
      });
    }

    return new Response(
      JSON.stringify({ scenario, results: analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
