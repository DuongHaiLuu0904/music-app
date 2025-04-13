import { Request, Response } from 'express'

import Topic from '../../models/topic.model'
import Song from '../../models/song.model'
import Singer from '../../models/singer.model'

// [GET] /songs/:slugTopic
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

    res.render('client/pages/songs/list', {
        title: topic.title,  
        songs: songsWithSingers,
    })
}

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response): Promise<any> => {
    const song = await Song.findOne({ 
        slug: req.params.slugSong,
        status: "active",
        deleted: false
    })

    if (!song) {
        return res.status(404).send('Song not found')
    }

    const infoSinger = await Singer.findOne({
        _id: song.singerId,
        status: "active",
        deleted: false
    }).select('fullName avatar')

    const topic = await Topic.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false
    }).select('title')

    res.render('client/pages/songs/detail', {
        title: song.title,  
        song: song,
        singer: infoSinger,
        topic: topic
    })
}

// [PATCH] /songs/like/:typeLike/:idSong
export const likeYes = async (req: Request, res: Response): Promise<any> => {
    const idSong = req.params.idSong
    const typeLike = req.params.typeLike

    const song = await Song.findOne({ 
        _id: idSong,
        status: "active",
        deleted: false
    })

    if (!song) {
        return res.status(404).send('Song not found')
    }

    let currentLikes: number = song.like || 0;
    currentLikes = typeLike == 'yes' ? currentLikes + 1 : currentLikes - 1


    await Song.updateOne(
        { _id: idSong }, 
        { like: currentLikes} 
    )
    
    res.json({
        code: 200,
        message: 'Like successfully',
        like : currentLikes 
    })
}