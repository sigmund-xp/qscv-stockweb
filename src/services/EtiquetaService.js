import backend from "@/backend";
  
class EtiquetaService {

  static getList(token) {
    return backend.post('/api/v1/etiqueta/list', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static create(etiqueta, token) {
    return backend.post('/api/v1/etiqueta', etiqueta, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static delete(id, token) {
    return backend.delete(`/api/v1/etiqueta/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}

export default EtiquetaService
