export default class User {
    status: string;
  
    constructor() {
      this.status = "I am happy to use chat"
    }

    getStatus(){
        return this.status
    }

    updateStatus(newStatus:string){
        this.status = newStatus
    }
  }
  