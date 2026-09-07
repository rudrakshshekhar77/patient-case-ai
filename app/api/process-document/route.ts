export async function POST(req: Request) {
  const { fileUrl } = await req.json()

  const imgRes = await fetch(fileUrl)
  const arrayBuffer = await imgRes.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = imgRes.headers.get('content-type') || 'image/jpeg'

  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: 'Extract all readable text from this medical document (prescription, report, or scan). Return only the extracted text, no commentary.' }
          ]
        }
      ]
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Gemini API error:', JSON.stringify(data))
    return Response.json({ error: data }, { status: 500 })
  }

  const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text extracted'
  return Response.json({ extractedText })
}