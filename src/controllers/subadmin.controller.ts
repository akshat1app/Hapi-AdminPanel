import User from "../models/user.model";
import { hashPassword } from "../utils/hash";
import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";

interface UpdateSubAdminPayload {
  email?: string;
  password?: string;
}

export const requireSuperAdmin = (user: any) => {
  if (user.role !== 'superadmin') {
    throw Boom.forbidden('Only Super Admins can perform this action');
  }
};

export const createSubAdmin = async (req: Request, h: ResponseToolkit) => {
  try {
    requireSuperAdmin(req.auth.credentials);
    const { email, password } = req.payload as {
      email: string;
      password: string;
    };

    const superadminExist = await User.findOne({ role: 'superadmin' });
    if (!superadminExist) {
      throw Boom.conflict("Super Admin not yet created");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw Boom.conflict("User with same Email Exists");
    }

    const subadmin = new User({
      email,
      password: await hashPassword(password),
      role: "subadmin",
    });

    await subadmin.save();

    const { password: _, ...rest } = subadmin.toObject(); // sanitize
    return h.response(rest).code(201);

  } catch (error) {
    if (Boom.isBoom(error)) throw error;
    console.error(error);
    throw Boom.internal("Failed to create subadmin");
  }
};

export const listSubAdmins = async (req: Request, h: ResponseToolkit) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [subadmins, total] = await Promise.all([
      User.find({ role: 'subadmin' }).skip(skip).limit(limit),
      User.countDocuments({ role: 'subadmin' }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return h.response({
      page,
      limit,
      totalPages,
      totalSubAdmins: total,
      subadmins,
    });
  } catch (err) {
    console.error(err);
    throw Boom.internal('Failed to fetch sub-admins');
  }
};

export const getSubAdmin = async (req: Request, h: ResponseToolkit) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      throw Boom.notFound("User not found");
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error(error);
    if (Boom.isBoom(error)) throw error;
    throw Boom.internal("Failed to fetch subadmin");
  }
};

export const updateSubAdmin = async (req: Request, h: ResponseToolkit) => {
  try {
    requireSuperAdmin(req.auth.credentials);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      throw Boom.notFound("User not found");
    }

    if (targetUser.role === "superadmin") {
      throw Boom.forbidden("Cannot modify Super Admin");
    }

    const payload = req.payload as UpdateSubAdminPayload;

    if (payload.password && payload.password.trim()) {
      payload.password = await hashPassword(payload.password);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).select("-password");

    if (!updated) {
      throw Boom.notFound("User not found after update");
    }

    return h.response(updated).code(200);
  } catch (error) {
    console.error(error);
    if (Boom.isBoom(error)) throw error;
    throw Boom.internal("Failed to update subadmin");
  }
};

export const deleteSubAdmin = async (req: Request, h: ResponseToolkit) => {
  try {
    requireSuperAdmin(req.auth.credentials);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      throw Boom.notFound("User not found");
    }

    if (targetUser.role === "superadmin") {
      throw Boom.forbidden("Cannot delete Super Admin");
    }

    await User.findByIdAndDelete(req.params.id);

    return h.response({ msg: "Sub-admin deleted successfully" }).code(200);
  } catch (error) {
    console.error(error);
    if (Boom.isBoom(error)) throw error;
    throw Boom.internal("Failed to delete subadmin");
  }
};
