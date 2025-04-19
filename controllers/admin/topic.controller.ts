import { Request, Response } from 'express'

import Topic from '../../models/topic.model'

import searchHelper from '../../helpers/search'
import paginationHelper from '../../helpers/pagination'
import filterStatusHelper from '../../helpers/filterStatus'


export const index = async (req: Request, res: Response) => {
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
    const countProducts = await Topic.countDocuments(find);

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
    
    const topics = await Topic.find(find).limit(objectPangination.limitItems).skip(objectPangination.skip).sort(sort)

    
    res.render('admin/pages/topics/index', {
        title: 'Trang sản phẩm',
        topics: topics,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPangination
    });
}

// [PATCH] /admin/topics/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const status: string = req.params.status

        await Topic.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.json({
            code: 200,
            message: 'Update status success',
        })
    }
    catch (error) {
        req.flash('error', 'Cập nhật trạng thái thất bại!');
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [PATCH] /admin/topics/change-multiple
export const changeMultiple = async (req: Request, res: Response) => {
    try {
        const ids: string[] = req.body.ids.split(", ")
        const type: string = req.body.type

        switch (type) {
            case 'active':
                await Topic.updateMany({ _id: { $in: ids } }, { status: 'active' })
                res.json({
                    code: 200,
                    message: 'Update status success',
                })
                break
            case 'inactive':
                await Topic.updateMany({ _id: { $in: ids } }, { status: 'inactive' })
                res.json({
                    code: 200,
                    message: 'Update status success',
                })
                break
            
            case 'delete-all':
                await Topic.updateMany({ _id: { $in: ids } }, { 
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

// [DELETE] /admin/topics/delete/:id
export const deleteTopic = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id

        await Topic.updateOne({ _id: id }, { 
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