export async function POST(req: Request) {
  const { caseRecord, documentTexts } = await req.json()

  const prompt = `You are a medical assistant helping a doctor prepare for a patient visit.
Based on the patient's questionnaire responses and any uploaded document text below, write a clear, structured clinical case summary for the doctor to review. Use these sections: Chief Complaint, History of Present Illness, Relevant Medical History, Findings from Documents, Suggested Points to Discuss.

QUESTIONNAIRE RESPONSES:
Chief Complaint: ${caseRecord.chief_complaint}
Symptoms: ${caseRecord.symptoms}
Duration: ${caseRecord.duration}
Medical History: ${caseRecord.medical_history}

DOCUMENT TEXT:
${documentTexts || 'None uploaded'}
`

  const apiKey = process.env.GEMINI_API_KEY
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('Gemini API error:', JSON.stringify(data))
    return Response.json({ error: data }, { status: 500 })
  }

  const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Could not generate summary'
  return Response.json({ summary })
}