export interface Paginate {
  page_size: number
  page_number: number
}

export class ResponseFormat<T> {
  code?: number
  data: T

  constructor(data: T) {
    this.code = 200
    this.data = data
  }
}

export class ErrorFormat {
  message: string

  constructor(msg: string) {
    this.message = msg
  }
}

export interface Media {
  bucket_name: string
  name: string
  uri: string
  signed_url: string
  type: string
}
