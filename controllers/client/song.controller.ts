import { Request, Response } from 'express'

import Topic from '../../models/topic.model'
import Song from '../../models/song.model'
import Singer from '../../models/singer.model'

export const list = async (req: Request, res: Response): Promise<any> => {
    const topic = await Topic.findOne({ 
        slug: req.params.slugTopic,
        status: "active",
        deleted: false
    })

    if (!topic) {
        return res.status(404).send('Topic not found')
    }

    const songs = await Song.find({
        topicId: topic._id,
        status: "active",
        deleted: false
    }).select('avatar title slug singerId like')

    const songsWithSingers = await Promise.all(songs.map(async (song) => {
        const infoSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        })
        
        return {
            ...song.toObject(),
            infoSinger: infoSinger
        }
    }))

    console.log('songsWithSingers', songsWithSingers)

    res.render('client/pages/songs/list', {
        title: topic.title,  
        songs: songsWithSingers,
    })
}
