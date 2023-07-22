from fastapi import FastAPI
import openai
from youtube_transcript_api import YouTubeTranscriptApi
from fastapi.middleware.cors import CORSMiddleware

openai.api_key = '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'

app = FastAPI(debug=True)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# text link https://www.youtube.com/watch?v=DXDe-2BC4cE

@app.get("/ytexplainer")
def root(yt_id):
  transcript = YouTubeTranscriptApi.get_transcript(yt_id)
  text = ""
  for i in transcript:
    text += i['text'] + " "
  completion = openai.ChatCompletion.create(
      model="gpt-3.5-turbo-16k",
      messages=[
          {"role": "system", "content": "The user will give you a full youtube transcript, your job is to summerize it to a paragraphor less, then explain what it means in a paragraph or less."},
          {"role": "user", "content": text}
      ],
      temperature=.5
  )
  return {"message": completion.choices[0].message.content}
  # return {"message": "The YouTuber talks about their recent experiences, including moving and dealing with technical issues. They mention that their YouTube channel has seen significant growth and express their desire to improve public transportation in their city. They discuss their plans to replace certain bus lines with tram lines and make adjustments to the infrastructure. They encounter challenges and frustrations in implementing these changes but eventually find solutions. They express satisfaction with the increased capacity and hope that the improvements will help alleviate traffic issues.In this video, the YouTuber shares their personal experiences and updates while also showcasing their gameplay of a city-building game. They discuss their channel's growth and their intention to improve public transportation in the game. They demonstrate their planning and decision-making process, as well as the challenges they face in implementing their ideas. Ultimately, they find solutions and express satisfaction with the results. The video provides a mix of personal anecdotes, gaming content, and a glimpse into the YouTuber's creative problem-solving skills."}
