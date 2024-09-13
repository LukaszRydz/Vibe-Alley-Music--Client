import mongoose from "mongoose";

export const ClientSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            immutable: true,
            unique: true,
            lowercase: true,
            minLength: 4,
            maxLength: 35,
        },
        role: {
            type: String,
            required: true,
            enum: ["client"],
            default: "client",
        },
        status: {
            state: {
                type: String,
                select: false,
                required: true,
                enum: ["active", "pendingDeletion"],
                default: "active",
            },
            updatedAt: {
                type: Date,
                select: false,
                required: true,
                default: () => new Date(),
            },
        },

        wishList: [
            {
                id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true,
                    ref: "Product",
                },
            },
        ],

        cart: [
            {
                id: { type: String },
                quantity: { type: Number },
            },
        ],

        auth: {
            password: { type: String, required: true, select: false },
            salt: { type: String, select: false },
            sessionToken: { type: String, select: false, unique: true, sparse: true },
        },
        spotify: {
            auth: {
                access_token: { type: String },
                refresh_token: { type: String },
                next_refresh: { type: Number },
                scope: { type: String },
            },
        },
    },
    {
        timestamps: true,
    }
);

export const ClientModel = mongoose.model("Client", ClientSchema);

export const createClient = (values: Record<string, any>) => ClientModel.create(values).then((Client: any) => Client.toObject());

export const getClientByEmail = (email: string) => ClientModel.findOne({ email: email });
export const getClientBySessionToken = (sessionToken: string) => ClientModel.findOne({ "auth.sessionToken": sessionToken });
export const getClientBySessionTokenAndId = (sessionToken: string, id: string) => {
    return ClientModel.findOne({
        _id: id,
        "auth.sessionToken": sessionToken,
    });
}
export const getClientById = (id: string) => ClientModel.findById(id);

export const existsBySessionToken = (sessionToken: string) => ClientModel.exists({ "auth.sessionToken": sessionToken });
export const existsByEmail = (email: string) => ClientModel.exists({ email: email });
export const existsBySessionTokenAndId = (sessionToken: string, id: string) => {
    return ClientModel.exists({
        _id: id,
        "auth.sessionToken": sessionToken,
    });
};
