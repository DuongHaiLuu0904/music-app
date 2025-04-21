import { Request, Response } from 'express'

import Topic from '../../models/topic.model'
import Song from '../../models/song.model'
import Singer from '../../models/singer.model'
import favoriteSong from '../../models/favorite-song.model'

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
    let song = await Song.findOne({ 
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
    
    let isFavoriteSong
    try {
        isFavoriteSong = await favoriteSong.findOne({
            songId: song._id,
            userId: res.locals.user._id,
        })
    } catch (error) {
        isFavoriteSong = false
    }

    res.render('client/pages/songs/detail', {
        title: song.title,  
        song: song,
        singer: infoSinger,
        topic: topic,
        isFavoriteSong: isFavoriteSong ? true : false
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

// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favoriteYes = async (req: Request, res: Response): Promise<any> => {
    const idSong = req.params.idSong
    const typeFavorite = req.params.typeFavorite

    if(!res.locals.user) {
        res.redirect('/users/login');
        return;
    }
    
    switch (typeFavorite) {
        case 'yes':
            const exitsFavoriteSong = await favoriteSong.findOne({
                songId: idSong
            })
            if(!exitsFavoriteSong) {
                const record = new favoriteSong({
                    songId: idSong,
                    userId: res.locals.user._id
                })
                await record.save()
            }
            break
        case 'no':
            await favoriteSong.deleteOne({
                songId: idSong,
                userId: res.locals.user._id
            })
            break
        default:
            break
    }
    res.json({
        code: 200,
        message: 'Favorite successfully'
    })
}

// [PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response): Promise<any> => {
    const idSong = req.params.idSong

    const song = await Song.findOne({ 
        _id: idSong,
        status: "active",
        deleted: false
    })

    if (!song) {
        return res.status(404).send('Song not found')
    }

    let currentListen: number = song.listen || 0;
    currentListen += 1

    await Song.updateOne(
        { _id: idSong }, 
        { listen: currentListen} 
    )
    
    const songNow = await Song.findOne({
        _id: idSong,
        status: "active",
        deleted: false
    }).select('listen')

    res.json({
        code: 200,
        message: 'Listen successfully',
        listen : songNow?.listen || currentListen
    })
}