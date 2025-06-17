import backend from "@/backend";

class ParamService {

  static getParams(token) {
    return backend.get('/api/v1/param', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

}

export default ParamService