import groupModel from "../model/groupModel.js";
import { generateUniqueId, Messages, StatusCodes } from "../utilities/config.js";

export const addGroupController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: Messages.PAYLOAD_MISSING_OR_INVALID
            });
        }
        console.log("request", request.body);
        const { name, description, members } = request.body;
        const { id: createdBy, email } = request.payload;

        if (!name || !members) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Group name and members are required"
            });
        }

        if (members.length < 1) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "At least one participant is required"
            });
        }

        const invalidParticipants = members.filter(p => !p.email);
        if (invalidParticipants.length > 0) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "All members must have an email"
            });
        }

        // const creatorExists = members.some(
        //     p => p.userId === createdBy || p.email === email
        // );
        // if (!creatorExists) {
        //     return response.status(StatusCodes.BAD_REQUEST).json({
        //         success: false,
        //         message: "Creator must be included in members"
        //     });
        // }

        const newId = await generateUniqueId(groupModel, "GRP");

        const newGroup = await groupModel.create({
            id: newId,
            name,
            description,
            createdBy,
            members
        });

        if (newGroup) {
            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Group created successfully"
            });
        }

        console.log("Failed to create group");
        return response.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: Messages.SOMETHING_WENT_WRONG
        });

    } catch (error) {
        console.log("Error in addGroupController", error);
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: Messages.SOMETHING_WENT_WRONG
        });
    }
};

export const updateGroupController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: Messages.PAYLOAD_MISSING_OR_INVALID
            });
        }

        const { id } = request.params;
        const { name, description, members } = request.body;
        const { id: userId, email } = request.payload;

        const existingGroup = await groupModel.findOne({ id: id });
        if (!existingGroup) {
            return response.status(StatusCodes.NO_CONTENT).json({
                success: false,
                message: "Group not found"
            });
        }

        if (existingGroup.createdBy !== userId) {
            return response.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Only the group creator can update the group"
            });
        }

        if (members) {
            if (members.length < 1) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "At least one participant is required"
                });
            }

            const invalidParticipants = members.filter(p => !p.email);
            if (invalidParticipants.length > 0) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "All members must have an email"
                });
            }

            const creatorExists = members.some(
                p => p.userId === userId || p.email === email
            );
            if (!creatorExists) {
                return response.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Creator must be included in members"
                });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (members) updateData.members = members;

        const updatedGroup = await groupModel.updateOne(
            { id: id },
            updateData,
            { new: true }
        );

        if (updatedGroup) {
            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Group updated successfully",
                data: updatedGroup
            });
        }

        console.log("Failed to update group");
        return response.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: Messages.SOMETHING_WENT_WRONG
        });

    } catch (error) {
        console.log("Error in updateGroupController", error);
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: Messages.SOMETHING_WENT_WRONG
        });
    }
};

export const getAllGroupController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: Messages.PAYLOAD_MISSING_OR_INVALID })
        }
        const allGroups = await groupModel.find().sort({ id: -1 });
        if (!allGroups) {
            console.log("Failed to getAllGroup")
            return response.status(StatusCodes.NO_CONTENT).json({ success: false, message: Messages.DATA_NOT_FOUND })
        }
        return response.status(StatusCodes.OK).json({ allGroups, success: true, message: "Groups Fetched Successfully" })
    } catch (error) {
        console.log("Error in getAllGroupController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}

export const getGroupByIdController = async (request, response) => {
    try {
        if (!request.payload) {
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Payload Missing or Invalid" })
        }
        const { id } = request.params;
        const group = await groupModel.findOne({ id: id }).lean();
        if (!group) {
            console.log("Group not found")
            return response.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid id" })
        }
        return response.status(StatusCodes.OK).json({ group, success: true, message: "Group Fetched Successfully" })
    } catch (error) {
        console.log("Error in getGroupByIdController", error)
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: Messages.SOMETHING_WENT_WRONG })
    }
}