import backend from "@/backend";
  
class StockService {

  static getList(token) {
    return backend.post('/api/v1/stock/list', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static create(etiqueta, token) {
    return backend.post('/api/v1/stock', etiqueta, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  static delete(id, token) {
    return backend.delete(`/api/v1/stock/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}

export default StockService
