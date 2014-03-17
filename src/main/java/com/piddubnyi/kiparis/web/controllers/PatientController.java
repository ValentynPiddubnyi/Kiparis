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
    public String printContacts(ModelMap model) {

        List<Contact> contacts = contactService.listContact();

        model.addAttribute("contacts", contacts);
        return "contactList";
    }

    @RequestMapping(value = "/patients/new", method = RequestMethod.POST)
    public String newPatient(@RequestParam(value = "firstName") String firstNameFake, @RequestParam String lastName,
                             @RequestParam String midleName, @RequestParam Diagnosis diagnosis, @RequestParam String profession,
                             @RequestParam @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date) {

        Contact contact = new Contact(1, lastName, firstNameFake, midleName, date, diagnosis, 1, profession);
        contactService.addContact(contact);
        return "redirect:/";
    }

    @RequestMapping(value = "/patients/remove", method = RequestMethod.POST)
    public  String removePatient(@RequestParam Integer removeID){
        contactService.removeContact(removeID);
        return "redirect:/";
    }

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        binder.registerCustomEditor(Date.class, new CustomDateEditor(
                dateFormat, false));
    }

}
