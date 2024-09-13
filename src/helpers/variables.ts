import dotenv from 'dotenv'
dotenv.config()

const error = (variable: string) => {
    console.error(`Missing environment variable: ${variable}`)
    process.exit(1)
}

export class Api {
    public static readonly VERSION = process.env.API_VERSION || error('API_VERSION')
    public static readonly PORT = process.env.API_PORT || error('API_PORT')
    public static readonly HOST = process.env.API_HOST || error('API_HOST')
    public static readonly PASSWORD_SECRET = process.env.API_PASSWORD_SECRET || error('API_PASSWORD_SECRET')
}

export class MongoDB {
    public static readonly COLLECTION = process.env.MONGODB_COLLECTION || error('MONGODB_COLLECTION')
    public static readonly PASSWORD = process.env.MONGODB_PASSWORD || error('MONGODB_PASSWORD')
    public static readonly URI = `mongodb+srv://lukaszrydzdev:${this.PASSWORD}@client.oosrw.mongodb.net/${this.COLLECTION}?retryWrites=true&w=majority&appName=CLIENT`
}

export class JWT {
    public static readonly SECRET = process.env.JWT_SECRET || error('JWT_SECRET')
    public static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || error('JWT_EXPIRES_IN')
    public static readonly COOKIE_NAME = process.env.JWT_COOKIE_NAME || error('JWT_COOKIE_NAME')
    public static readonly ALGORITHM = process.env.JWT_ALGORITHM || error('JWT_ALGORITHM')
}