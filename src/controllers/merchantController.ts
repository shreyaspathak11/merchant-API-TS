import { Request, Response } from 'express';
import MerchantModel from '../models/Merchant';

// List all merchants
export const listMerchants = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, pageSize = 10, searchQuery, dateFrom, dateTo } = req.query as {
            page?: string;
            pageSize?: string;
            searchQuery?: string;
            dateFrom?: string;
            dateTo?: string;
        };


        const query: any = {};

        if (searchQuery) {
            query.$or = [
                { merchantName: { $regex: new RegExp(searchQuery, 'i') } },
                { email: { $regex: new RegExp(searchQuery, 'i') } },
            ];
        }

        if (dateFrom && dateTo) {
            query.createdAt = {
                $gte: dateFrom,
                $lte: dateTo,
            };
        }

        const merchants = await MerchantModel.find(query)
            .skip((Number(page) - 1) * Number(pageSize))
            .limit(Number(pageSize));

        const total = await MerchantModel.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'List of all merchants successfully retrieved',
            merchants,
            total,
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Add a merchant
export const addMerchant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { storeID, merchantName, email, commission } = req.body;

        if (!storeID || !merchantName || !email || !commission) {
            res.status(400).json({
                success: false,
                message: 'Please enter all required fields',
            });
            return; 
        }

        const existingMerchant = await MerchantModel.findOne({ email });
        if (existingMerchant) {
            res.status(400).json({
                success: false,
                message: 'Merchant already exists',
            });
            return;
        }

        const newMerchant = await MerchantModel.create({
            storeID,
            merchantName,
            email,
            commission,
        });

        res.status(200).json({
            success: true,
            message: 'Merchant created successfully',
            newMerchant,
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update a merchant
export const updateMerchant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { merchantId } = req.params;
        const { merchantName, email, commission } = req.body;

        if (!merchantName || !email || !commission) {
             res.status(400).json({ 
                success: false,
                message: 'Missing required fields'
            });
            return;
        }

        const existingMerchant = await MerchantModel.findById(merchantId);
        if (!existingMerchant) {
            res.status(404).json({ 
                success: false, 
                message: 'Merchant not found'
            });
            return;
        }

        existingMerchant.merchantName = merchantName;
        existingMerchant.email = email;
        existingMerchant.commission = commission;

        const updatedMerchant = await existingMerchant.save();

        res.status(200).json({
            success: true,
            message: 'Merchant updated successfully',
            updatedMerchant,
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete a merchant
export const deleteMerchant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { merchantId } = req.params;

        const existingMerchant = await MerchantModel.findById(merchantId);
        if (!existingMerchant) {
            res.status(404).json({ 
                success: false, 
                message: 'Merchant not found' 
            });
            return;
        }

        await MerchantModel.findByIdAndDelete(merchantId);

        res.status(200).json({
            success: true,
            message: 'Merchant deleted successfully',
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get merchant details
export const getMerchant = async (req: Request, res: Response): Promise<void> => {
    try {
        const { merchantId } = req.params;

        const existingMerchant = await MerchantModel.findById(merchantId);
        if (!existingMerchant) {
            res.status(404).json({ 
                success: false, 
                message: 'Merchant not found' 
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Merchant details retrieved successfully',
            existingMerchant,
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Filter merchants
export const filterMerchants = async (req: Request, res: Response): Promise<void> => {
    try {
        const { filterOption } = req.query as { filterOption?: string };

        if (!filterOption) {
            res.status(400).json({ 
                success: false, 
                message: 'No filter options provided' 
            });
            return;
        }

        let filters;

        try {
            filters = JSON.parse(filterOption);
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid filter options' 
            });
            return;
        }

        const query: any = {};

        if (filters.merchantName) {
            query.merchantName = { $regex: new RegExp(filters.merchantName, 'i') };
        }
        if (filters.email) {
            query.email = { $regex: new RegExp(filters.email, 'i') };
        }
        if (filters.commission) {
            query.commission = Number(filters.commission);
        }

        const filteredMerchants = await MerchantModel.find(query);

        res.status(200).json({
            success: true,
            message: 'Merchants filtered successfully',
            filteredMerchants,
        });
    } catch (error : any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

