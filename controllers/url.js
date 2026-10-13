const {nanoid} = require('nanoid')
const mongoose = require('../models/url')

async function handleGenerateNewShortUrl(req, res){
    const body = req.body
    if(!body.url) return res.json(400).json({error:'url is required'})
    const shortId = nanoid(8)
    await URL.create({
        shortId: shortId,
        redirectURL:body.url,
        visitHistory: [],
})
return res.json({id: shortID})
}

module.exports = {
    handleGenerateNewShortUrl
}