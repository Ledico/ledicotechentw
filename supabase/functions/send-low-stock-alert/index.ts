import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    // Check if this is a low stock situation (quantity <= 2)
    if (record.quantity > 2) {
      return new Response(
        JSON.stringify({ message: 'Stock level is sufficient, no alert needed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Prepare email content
    const emailSubject = `🚨 SUISA Inventar: Knapper Bestand - ${record.name}`
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">⚠️ Knapper Bestand Warnung</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #dc2626; margin-top: 0;">Artikel mit kritischem Bestand:</h2>
          
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${record.name}</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Kategorie:</strong> ${record.category}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Aktuelle Menge:</strong> <span style="color: #dc2626; font-weight: bold;">${record.quantity} ${record.unit}</span></p>
            ${record.description ? `<p style="margin: 5px 0; color: #6b7280;"><strong>Beschreibung:</strong> ${record.description}</p>` : ''}
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; border: 1px solid #f59e0b; margin: 15px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">📋 Empfohlene Maßnahmen:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e;">
              <li>Sofortige Nachbestellung prüfen</li>
              <li>Lieferanten kontaktieren</li>
              <li>Alternative Artikel evaluieren</li>
              <li>Bestand im SUISA Portal aktualisieren</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://your-domain.com/suisa" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              🔗 SUISA Portal öffnen
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Diese automatische Benachrichtigung wurde vom SUISA Inventarsystem gesendet.<br>
            Zeitpunkt: ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Zurich' })}
          </p>
        </div>
      </div>
    `

    // Send email using Resend (you'll need to set up Resend API key)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SUISA Inventar <noreply@your-domain.com>',
        to: ['leonardorafael.costa04@gmail.com'],
        subject: emailSubject,
        html: emailBody,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Failed to send email: ${errorText}`)
    }

    const emailResult = await emailResponse.json()

    return new Response(
      JSON.stringify({ 
        message: 'Low stock alert sent successfully',
        emailId: emailResult.id,
        item: record.name,
        quantity: record.quantity
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending low stock alert:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send low stock alert',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})