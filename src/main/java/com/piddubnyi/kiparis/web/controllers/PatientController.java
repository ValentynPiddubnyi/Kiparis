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

import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by Fil on 09/03/14.
 */

@Controller
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    ContactService contactService;

    @RequestMapping(method = RequestMethod.GET)
    public String printContacts(ModelMap model, Principal principal) {

        String userName = principal.getName();
        List<Contact> contacts = contactService.listContact();

        model.addAttribute("userName", userName);
        model.addAttribute("contacts", contacts);
        return "contactList";
    }

    @RequestMapping(value = "/new", method = RequestMethod.POST)
    public String newPatient(@RequestParam(value = "firstName") String firstNameFake, @RequestParam String secondName,
                             @RequestParam String thirdName, @RequestParam Diagnosis diagnosis, @RequestParam String profession,
                             @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {

        Contact contact = new Contact(1, secondName, firstNameFake, thirdName, date, diagnosis, profession);
        contactService.addContact(contact);
        return "redirect:/patients";
    }

    @RequestMapping("/edit")
    public String editPatient(@RequestParam String firstNameEdit, @RequestParam String secondNameEdit,
                              @RequestParam String thirdNameEdit, @RequestParam Diagnosis diagnosisEdit, @RequestParam String professionEdit,
                              @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date dateEdit, @RequestParam Integer idEdit){

        Contact contactEdit = contactService.findById(idEdit);
        contactEdit.setFirstName(firstNameEdit);
        contactEdit.setSecondName(secondNameEdit);
        contactEdit.setThirdName(thirdNameEdit);
        contactEdit.setDiagnosis(diagnosisEdit);
        contactEdit.setProfession(professionEdit);
        contactEdit.setBirthday(dateEdit);
        contactService.save(contactEdit);
        return "redirect:/patients";
    }

    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    public  String removePatient(@RequestParam Integer removeID){
        contactService.removeContact(removeID);
        return "redirect:/patients";
    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(
                dateFormat, false));
    }
}
