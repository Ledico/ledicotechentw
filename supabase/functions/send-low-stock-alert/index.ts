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

    // Prepare email content with German localization
    const emailSubject = `🚨 SUISA Inventar: Knapper Bestand - ${record.name}`
    const emailBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">⚠️ Knapper Bestand Warnung</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">SUISA Inventarverwaltung</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 20px;">Artikel mit kritischem Bestand:</h2>
          
          <!-- Item Details Card -->
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 5px solid #dc2626; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: bold;">${record.name}</h3>
            
            <div style="display: grid; gap: 8px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #64748b; font-weight: 500;">Kategorie:</span>
                <span style="color: #334155; font-weight: 600;">${record.category}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #64748b; font-weight: 500;">Aktuelle Menge:</span>
                <span style="color: #dc2626; font-weight: bold; font-size: 18px;">${record.quantity} ${record.unit}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                <span style="color: #64748b; font-weight: 500;">Status:</span>
                <span style="color: #059669; font-weight: 600;">${record.status}</span>
              </div>
              
              ${record.description ? `
              <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                <span style="color: #64748b; font-weight: 500;">Beschreibung:</span>
                <span style="color: #334155; max-width: 300px; text-align: right;">${record.description}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Alert Box -->
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 8px; border: 1px solid #f59e0b; margin: 20px 0;">
            <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; display: flex; align-items: center;">
              📋 Empfohlene Maßnahmen:
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.6;">
              <li style="margin-bottom: 8px;"><strong>Sofortige Nachbestellung prüfen</strong></li>
              <li style="margin-bottom: 8px;">Lieferanten kontaktieren</li>
              <li style="margin-bottom: 8px;">Alternative Artikel evaluieren</li>
              <li style="margin-bottom: 8px;">Bestand im SUISA Portal aktualisieren</li>
            </ul>
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://ledicotechentw.netlify.app/suisa" 
               style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
              🔗 SUISA Portal öffnen
            </a>
          </div>
          
          <!-- Separator -->
          <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0;">
          
          <!-- Footer -->
          <div style="text-align: center; color: #64748b; font-size: 14px;">
            <p style="margin: 0 0 10px 0;">
              <strong>Diese automatische Benachrichtigung wurde vom SUISA Inventarsystem gesendet.</strong>
            </p>
            <p style="margin: 0; opacity: 0.8;">
              📅 Zeitpunkt: ${new Date().toLocaleString('de-DE', { 
                timeZone: 'Europe/Zurich',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
            <p style="margin: 10px 0 0 0; opacity: 0.6; font-size: 12px;">
              SUISA Portal - Inventarverwaltung | Leonardo Dias Costa
            </p>
          </div>
        </div>
      </div>
    `

    // Send email using Resend with your API key
    const resendApiKey = 're_9LLvy2d9_8RyW36jCSRcoGnhuRYVQDynZ'
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SUISA Inventar <noreply@ledicotechentw.netlify.app>',
        to: ['leonardorafael.costa04@gmail.com'],
        subject: emailSubject,
        html: emailBody,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Resend API Error:', errorText)
      throw new Error(`Failed to send email: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ 
        message: 'Low stock alert sent successfully',
        emailId: emailResult.id,
        item: record.name,
        quantity: record.quantity,
        recipient: 'leonardorafael.costa04@gmail.com'
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