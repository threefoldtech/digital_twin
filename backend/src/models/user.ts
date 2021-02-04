import { getUserdata, persistUserdata } from "../service/dataService"
export default class User {
    status: string;
  
    constructor() {
      try{
        const userData = getUserdata()
        this.status = userData.status
      }
      catch(error){
        this.status = "Exploring the new DigitalTwin"
        persistUserdata({status:this.status})
      }
    }

    getStatus(){
        return this.status
    }
    getData(){
      return {
        status: this.status
      }
    }

    updateStatus(newStatus:string){
        this.status = newStatus
    }
  }
  