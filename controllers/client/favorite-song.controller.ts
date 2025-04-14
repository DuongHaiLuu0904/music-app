import { Request, Response } from 'express';

import Topic from '../../models/topic.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
import favoriteSong from '../../models/favorite-song.model';

export const index = async (req: Request, res: Response): Promise<any> => {
    let favoriteSongs = await favoriteSong.find({
        deleted: false
    });

    const data: any[] = [];

    for (const item of favoriteSongs) {

        const infoSong = await Song.findOne({
            _id: item.songId,
            deleted: false
        });

        if (!infoSong) {
            res.status(404).send('Song not found');
            return;
        }

        const infoSinger = await Singer.findOne({
            _id: infoSong.singerId,
            deleted: false
        });

        if (!infoSinger) {
            res.status(404).send('Singer not found');
            return;
        }

        // Tạo object plain và gán infoSong vào.
        const plainItem = item.toObject() as any;
        plainItem.infoSong = infoSong;
        plainItem.infoSinger = infoSinger;

        data.push(plainItem);
    }

    res.render('client/pages/favorite-songs/index', {
        title: 'Favorite Songs',
        favoriteSongs: data
    });
};
