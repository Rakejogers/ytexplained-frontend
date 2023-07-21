const express = require('express');
const YoutubeTranscript = require('youtube-transcript').default;
const { Configuration, OpenAIApi } = require("openai");

const app = express();

// console.log(YoutubeTranscript)

YoutubeTranscript.fetchTranscript('https://www.youtube.com/watch?v=XBu54nfzxAQ').then(console.log);

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.get('/ytexplainer', (req, res) => {
    const youtubeLink = req.query.youtubeLink;
    console.log(youtubeLink)
    const transcript = YoutubeTranscript.list_transcripts(youtubeLink);
    const transcriptText = transcript.fetch();
    // const transcript = "test"
    async function getSummary(transcript) {

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            messages: [{ "role": "system", "content": "The user will give you a full youtube transcript, your job is to summerize it to a paragraphor less, then explain what it means in a paragraph or less." }, { role: "user", content: transcript }],
        });
        return completion.data.choices[0].message;
    }
    
    try{
        getSummary(transcript).then((response) => {
            res.send(response);
        });
    } catch (error) {
        console.log(error);
    }

});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);