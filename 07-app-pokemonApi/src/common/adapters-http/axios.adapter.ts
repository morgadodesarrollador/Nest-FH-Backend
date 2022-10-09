import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapters.interface";

@Injectable()
export class AxiosAdapter implements HttpAdapter{
    private axios: AxiosInstance = axios;

    async get<T>(url:string): Promise<T>{
        try { //la data es de tipo <T>
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            throw new Error('This is an erro - Check Logs');
        }
    }
}
