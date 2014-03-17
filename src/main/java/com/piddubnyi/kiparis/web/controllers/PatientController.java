package com.piddubnyi.kiparis.web.controllers;

import com.piddubnyi.kiparis.model.Diagnosis;
import com.piddubnyi.kiparis.model.Contact;
import com.piddubnyi.kiparis.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Fil on 09/03/14.
 */

@Controller
@RequestMapping("/")
public class PatientController {

    @Autowired
    ContactService contactService;

    @RequestMapping(method = RequestMethod.GET)
    public String printContacts(ModelMap model, HttpSession session){

    /*List<Contact> contacts = (List<Contact>) session.getAttribute("contacts");
    if (contacts==null){
        contacts = new ArrayList();
        contacts.add(new Contact(1,"Поддубный","Валентин","Владимирович",new Date(19850705), Diagnosis.GRIGA,1, "Инженер") );
        contacts.add(new Contact(2,"Поддубный2","Валентин2","Владимирович2",new Date(19850705),Diagnosis.PERELOM,2, "Зубр") );
        contacts.add(new Contact(3,"Поддубный3","Валентин3","Владимирович3",new Date(19850705),Diagnosis.PRATRYZIYA,3, "Говнокодер") );
        contacts.add(new Contact(4,"Поддубный4","Валентин4","Владимирович4",new Date(19850705),Diagnosis.GRIGA,4, "Программист") );
        contacts.add(new Contact(5,"Поддубный5","Валентин5","Владимирович5",new Date(19850706),Diagnosis.PRATRYZIYA,5, "Реабилитолог") );
        session.setAttribute("contacts", contacts);
    }*/
    List<Contact> contacts = contactService.listContact();

    model.addAttribute("contacts", contacts);
    return "contactList";
}

    @RequestMapping(value = "/patients/new", method = RequestMethod.POST)
    public String newPatient(@RequestParam(value = "firstName") String firstNameFake, @RequestParam String lastName,
                             @RequestParam String midleName, @RequestParam Diagnosis diagnosis, @RequestParam String profession,
                             @RequestParam @PathVariable @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) Date date, HttpSession session){
        List<Contact> contacts = (List<Contact>) session.getAttribute("contacts");
        if (contacts==null){
            contacts = new ArrayList();
            session.setAttribute("contacts", contacts);
        }
        contacts.add(new Contact(1,lastName,firstNameFake,midleName,date,diagnosis,1, profession) );
        return "redirect:/";
    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(
                dateFormat, false));
    }

}
