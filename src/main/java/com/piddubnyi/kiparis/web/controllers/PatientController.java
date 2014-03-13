package com.piddubnyi.kiparis.web.controllers;

import com.piddubnyi.kiparis.model.Diagnosis;
import com.piddubnyi.kiparis.persist.Contact;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import sun.net.www.content.text.plain;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Fil on 09/03/14.
 */

@Controller
@RequestMapping("/")
public class PatientController {

    @RequestMapping(method = RequestMethod.GET)
    public String printContacts(ModelMap model, HttpSession session){
    List<Contact> contacts = (List<Contact>) session.getAttribute("contacts");
    if (contacts==null){
        contacts = new ArrayList();
        contacts.add(new Contact(1,"Поддубный","Валентин","Владимирович",19850705, Diagnosis.GRIGA,1, "Инженер") );
        contacts.add(new Contact(2,"Поддубный2","Валентин2","Владимирович2",19850705,Diagnosis.PERELOM,2, "Зубр") );
        contacts.add(new Contact(3,"Поддубный3","Валентин3","Владимирович3",19850705,Diagnosis.PRATRYZIYA,3, "Говнокодер") );
        contacts.add(new Contact(4,"Поддубный4","Валентин4","Владимирович4",19850705,Diagnosis.GRIGA,4, "Программист") );
        contacts.add(new Contact(5,"Поддубный5","Валентин5","Владимирович5",19850706,Diagnosis.PRATRYZIYA,5, "Реабилитолог") );
        session.setAttribute("contacts", contacts);
    }


    model.addAttribute("contacts", contacts);
    return "contactList";
}

    @RequestMapping(value = "/patients/new", method = RequestMethod.POST)
    public String newPatient(@RequestParam(value = "firstName") String firstNameFake, @RequestParam String lastName, @RequestParam String midleName, @RequestParam Diagnosis diagnosis, @RequestParam String profession, HttpSession session){
        List<Contact> contacts = (List<Contact>) session.getAttribute("contacts");
        if (contacts==null){
            contacts = new ArrayList();
            session.setAttribute("contacts", contacts);
        }
        contacts.add(new Contact(1,lastName,firstNameFake,midleName,19850705,diagnosis,1, profession) );
        return "redirect:/";
    }

}
