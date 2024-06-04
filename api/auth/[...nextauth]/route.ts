import { NextApiRequest, NextApiResponse } from "next";
import { getOAuth2UrlAndLogin } from "@/lib/taskHandlers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const oauthUrl = await getOAuth2UrlAndLogin();
    res.redirect(oauthUrl);
}