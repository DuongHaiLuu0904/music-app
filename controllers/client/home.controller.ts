import { Request, Response } from 'express'

import Song from '../../models/song.model'
import Topic from '../../models/topic.model'
import FavoriteSong from '../../models/favorite-song.model'
import Singer from '../../models/singer.model'

// [GET] /
export const index = async (req: Request, res: Response): Promise<any> => {
    const topics = await Topic.find({ deleted: false }).limit(2).sort({ createdAt: -1 })

    const songs = await Song.find({
        status: "active",
        deleted: false
    }).limit(2).sort({ like: -1 })

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
    
    res.render('client/pages/home/index', {
        title: 'Trang chủ',
        songs: songsWithSingers,
        topics: topics
    })
}