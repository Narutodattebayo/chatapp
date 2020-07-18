export interface IFilteredRequest<T={}> extends Request {
    data?: T
}