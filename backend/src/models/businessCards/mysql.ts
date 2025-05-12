import Model from "./model";
import DTO from './dto';
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";

class BusinessCards implements Model {

    public async getAll(): Promise<DTO[]> {
        const cards = (await query(`
            SELECT  bc.id,
                    bc.company,
                    bc.coverImage,
                    bc.profileImage,
                    bc.name,
                    bc.description,
                    bc.about,
                    bc.email,
                    bc.phone,
                    bc.website,
                    bc.address,
                    bc.created_at,
                    bc.updated_at,
                    bc.ownedBy,
                    bc.themeColor,
                    bc.backgroundColor,
                    bc.textColor,
                    u.firstName,
                    u.lastName
            FROM    business_cards bc
            LEFT JOIN users u ON bc.ownedBy = u.userId  
            ORDER BY company ASC
        `,));
        return cards;
    }

    public async getOne(company: string): Promise<DTO> {
        const card = (await query(`
            SELECT  id,
                    company,
                    coverImage,
                    profileImage,
                    name,
                    description,
                    about,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at,
                    ownedBy,
                    themeColor,
                    backgroundColor,
                    textColor
            FROM    business_cards  
            WHERE   company = ?
        `, [company]))[0];
        return card;
    }

    public async getOneById(id: string): Promise<DTO> {
        const card = (await query(`
            SELECT  id,
                    company,
                    coverImage,
                    profileImage,
                    name,
                    description,
                    about,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at,
                    ownedBy,
                    themeColor,
                    backgroundColor,
                    textColor
            FROM    business_cards  
            WHERE   id = ?
        `, [id]))[0];
        return card;
    }

    public async add(card: DTO): Promise<DTO> {
        const { company, coverImage, profileImage, name, description, about, email, phone, website, address, created_at, updated_at, ownedBy, themeColor, backgroundColor, textColor } = card;
        const id = v4();
        const socialId = v4()
        const addCard: OkPacketParams = await query(`
            INSERT INTO business_cards(id, company, coverImage, profileImage, name, description,about, email, phone, website, address, created_at, updated_at, ownedBy, themeColor, backgroundColor, textColor )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?)
            `, [id, company, coverImage, profileImage, name, description, about, email, phone, website, address, created_at, updated_at, ownedBy || null, themeColor || '', backgroundColor || '', textColor || '']);
        await query(`
                INSERT INTO social_links(id, company_id, company, facebook, instagram, linkedin, twitter, whatsapp, email, map, phone, tiktok)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [socialId, id, company, null, null, null, null, null, null, null, null, null, null]);
        return this.getOneById(id);
    }

    public async deleteCard(id: string): Promise<boolean> {
        const result: OkPacketParams = await query(`
            DELETE FROM business_cards
            WHERE       id = ?
        `, [id]);
        return Boolean(result.affectedRows);
    }

    public async update(card: DTO): Promise<DTO> {
        const { id, company, coverImage, profileImage, name, description, about, email, phone, website, address, ownedBy, themeColor, backgroundColor, textColor } = card;
        const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
        await query(`
                UPDATE  business_cards
                SET     company = ?,
                        coverImage = ?,
                        profileImage = ?,
                        name = ?,
                        description = ?,
                        about = ?,
                        email = ?,
                        phone = ?,
                        website = ?,
                        address = ?,
                        updated_at = ?,
                        ownedBy = ?,
                        themeColor = ?,
                        backgroundColor = ?,
                        textColor = ?
                WHERE   id = ?
            `, [company, coverImage, profileImage, name, description, about, email, phone, website, address, updated_at, ownedBy || null, themeColor, backgroundColor, textColor, id]);
        return this.getOneById(id);
    }

    public async getUserCards(id: string): Promise<DTO> {
        const cards = (await query(`
            SELECT  id,
                    company,
                    coverImage,
                    profileImage,
                    name,
                    description,
                    about,
                    email,
                    phone,
                    website,
                    address,
                    created_at,
                    updated_at,
                    ownedBy,
                    themeColor,
                    backgroundColor,
                    textColor
            FROM    business_cards  
            WHERE   ownedBy = ?
        `, [id]));

        console.log(cards)
        return cards;
    }

    public async assignCardOwner(cardId: string, userId: string | null): Promise<DTO> {
        const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");

        if (!userId) {
            userId = null;
        }

        await query(`
            UPDATE  business_cards
            SET     ownedBy = ?,
                    updated_at = ?
            WHERE   id = ?
        `, [userId, updated_at, cardId]);

        return this.getOneById(cardId);
    }

    public async getColors(id: string): Promise<DTO> {
        const card = (await query(`
            SELECT  themeColor,
                    backgroundColor,
                    textColor
            FROM    business_cards  
            WHERE   id = ?
        `, [id]))[0];
        return card;
    }
}

const business_cards = new BusinessCards();
export default business_cards;