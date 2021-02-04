import Contact from "../models/contact";

const dummycontact = new Contact("jason_parser", "localhost:3000");


export let contacts: Array<Contact> = [ dummycontact ];
