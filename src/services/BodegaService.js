import backend from "@/backend";
  
class BodegaService {

  static getList(token) {
    return backend.post('/api/v1/bodega/list', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static getListCombo(token) {
    return backend.post('/api/v1/bodega/list', { kind: "combo"}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static create(bodega, token) {
    return backend.post('/api/v1/bodega', bodega, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static delete(id, token) {
    return backend.delete(`/api/v1/bodega/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}

export default BodegaService
