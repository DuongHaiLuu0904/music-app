import { Request, Response } from 'express'

import Song from '../../models/song.model'
import Topic from '../../models/topic.model'
import Singer from '../../models/singer.model'

import searchHelper from '../../helpers/search'
import paginationHelper from '../../helpers/pagination'
import filterStatusHelper from '../../helpers/filterStatus'
import { Types } from 'mongoose'
import { systemConfig } from '../../config/configAdmin'

// Interface cho Song
interface ISong {
    _id: Types.ObjectId | string;
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    singerId?: string | null;
    topicId?: string | null;
    avatar?: string | null;
    audio?: string | null;
    status?: string | null;
    position?: number | null;
    lyrics?: string | null;
    like: number | null | undefined;
    listen: number | undefined | null;
    deleted: boolean| null;
    deleteAt?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

// Interface cho song đã có thông tin singer và topic
interface ISongWithInfo extends ISong {
    infoSinger?: {
        _id: string;
        fullName: string;
    } | null;
    infoTopic?: {
        _id: string;
        title: string;
    } | null;
}

// [GET] /admin/songs
export const index = async (req: Request, res: Response): Promise<void> => {
    interface FindQuery {
        deleted: boolean;
        status?: string;
        title?: RegExp;
        $or?: Array<{title: RegExp} | {slug: RegExp}>
    }
    
    const find: FindQuery  = { 
        deleted: false, 
    };

    // Bộ lọc 
    const filterStatus = filterStatusHelper(req.query)

    if (req.query.status) {
        find.status = req.query.status as string
    }
   
    
    // Tìm kiếm
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        const searchConditions: Array<{title: RegExp} | {slug: RegExp}> = [
            { title: objectSearch.regex }
        ];
        
        if (objectSearch.keywordSlug) {
            searchConditions.push({ slug: objectSearch.keywordSlug });
        }
        
        find.$or = searchConditions as [{ title: RegExp}, { slug: RegExp }];
    }
    //

    // Phân trang 
    const countProducts = await Song.countDocuments(find);

    let objectPangination = paginationHelper(
        {
            currentPage: 1,       
            limitItems: 4
        },
        req.query,
        countProducts
    );

    //

    // Sort
    const sort: Record<string, any> = {};
    const { sortKey, sortValue } = req.query;
    if (typeof sortKey === 'string' && typeof sortValue === 'string') {
        sort[sortKey] = sortValue;
    } else {
        sort["position"] = "desc";
    }
    //
    
    const songs: ISongWithInfo[] = await Song.find(find).limit(objectPangination.limitItems).skip(objectPangination.skip).sort(sort)

    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        }).select('fullName')
        
        const infoTopic = await Topic.findOne({
            _id: song.topicId,
            status: "active",
            deleted: false
        }).select(' title')
        
        song.infoSinger = infoSinger as any
        song.infoTopic = infoTopic as any
    }

    res.render('admin/pages/songs/index', {
        title: 'Tổng quan',
        songs: songs,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPangination
    })
}


export const detail = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const task = await Song.findOne({ _id: id, deleted: false })
    res.json(task)
}

// [PATCH] /admin/songs/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id
        const status: string = req.params.status

        await Song.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.json({
            code: 200,
            message: 'Update status success',
        })
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [PATCH] /admin/songs/change-multiple
export const changeMultiple = async (req: Request, res: Response): Promise<void> => {
    try {
        const ids: string[] = req.body.ids.split(", ")
        const type: string = req.body.type

        switch (type) {
            case 'active':
                await Song.updateMany({ _id: { $in: ids } }, { status: 'active' })
                res.json({
                    code: 200,
                    message: 'Update status success',
                })
                break
            case 'inactive':
                await Song.updateMany({ _id: { $in: ids } }, { status: 'inactive' })
                res.json({
                    code: 200,
                    message: 'Update status success',
                })
                break
            
            case 'delete-all':
                await Song.updateMany({ _id: { $in: ids } }, { 
                    deleted: true, 
                    deletedAt: new Date()
                })
                res.json({
                    code: 200,
                    message: 'Delete success',
                })
                break
            // case 'change-position':
            //     for(const item of ids) {
            //         let [id, position] = item.split("-")
            //         position = parseInt(position)

            //         await Song.updateOne({ _id: id }, { position: position })
            //     }
            default:
                break
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response): Promise<void> => {
    const topics = await Topic.find({ deleted: false, status: 'active' }).select('title')
    const singers = await Singer.find({ deleted: false, status: 'active' }).select('fullName')
    
    res.render('admin/pages/songs/create', {
        title: 'Thêm mới bài hát',
        topics: topics,
        singers: singers,
    })
}

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            position: (req.body.position) ? parseInt(req.body.position) : (await Song.countDocuments({ deleted: false })) + 1,
            status: req.body.status,
            avatar: req.body.avatar[0],
            audio: req.body.audio[0],
        }
        const song = new Song(dataSong)
        await song.save()

        req.flash('success', 'Thêm mới bài hát thành công!')
        res.redirect(`${systemConfig.prefixAdmin}/songs`)
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}


export const edit = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id

        await Song.updateOne({ _id: id }, req.body)

        res.json({
            code: 200,
            message: 'Update success',
        })
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [DELETE] /admin/songs/delete/:id
export const deleteSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id

        await Song.updateOne({ _id: id }, { 
            deleted: true, 
            deletedAt: new Date()
        })

        res.json({
            code: 200,
            message: 'Delete success',
        })
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}