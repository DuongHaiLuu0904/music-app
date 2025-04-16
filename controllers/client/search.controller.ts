import { Request, Response } from 'express'

import Song from '../../models/song.model'
import Singer from '../../models/singer.model'

import { convertToSlug } from '../../helpers/convertToSlug'

// [GET] /search/:type
export const result = async (req: Request, res: Response) => {
    const type: string = req.params.type
    
    const keyword: string = `${req.query.keyword}`

    let newSong = []

    if (keyword) {
        const keywordRegex = new RegExp(keyword, 'i')

        const keywordSlug = new RegExp(convertToSlug(keyword), 'i')

        const songs = await Song.find({
            $or: [
                { title: keywordRegex},
                { slug: keywordSlug }
            ]
        })

        for (const song of songs) {
            const infoSinger = await Singer.findOne({ _id: song.singerId })

            const songCopy = song.toObject() as any
            songCopy.infoSinger = infoSinger

            newSong.push(songCopy)
        }
    }

    switch (type) {
        case 'result':    
            res.render('client/pages/search/result', {
                title: `Tìm kiếm: ${keyword}`,
                keyword: keyword,
                songs: newSong
            })
            break
        case 'suggest':
            res.json({
                code: 200,
                message: 'success',
                songs: newSong
            })
            break
        default:
            break
    }
}
