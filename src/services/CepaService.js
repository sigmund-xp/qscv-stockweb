import backend from "@/backend";
  
class CepaService {

  static getList(token) {
    return backend.post('/api/v1/cepa/list', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static create(cepa, token) {
    return backend.post('/api/v1/cepa', cepa, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static delete(id, token) {
    return backend.delete(`/api/v1/cepa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}

export default CepaService
