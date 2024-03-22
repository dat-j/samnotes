
import axiosClient from "./axiosClient"


const groupApi = {
    createGroup(id,data){
        const url = `/group/create/`+id
        return axiosClient.post(url, data)
    },
    getAllGroups(id){
        const url = `/group/all/`+id
        return axiosClient.get(url)
    },
    getGroup(id){
        const url = `/group/only/`+id
        return axiosClient.get(url)
    },
    getMessage(id){
        const url = `/group/messages/`+id
        return axiosClient.get(url)
    },
    getImage(id){
        const url = `/group/images/`+id
        return axiosClient.get(url)
    }
}
export default groupApi;