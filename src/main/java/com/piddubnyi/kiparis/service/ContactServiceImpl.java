package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.dao.ContactDAO;
import com.piddubnyi.kiparis.model.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by fil on 3/13/14.
 */
@Service
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactDAO contactDAO;

    @Override
    @Transactional
    public void addContact(Contact contact) {
        contactDAO.addContact(contact);
    }

    @Override
    public List<Contact> listContact() {
        return contactDAO.listContact();
    }

    @Override
    public void removeContact(Integer id) {
        contactDAO.removeContact(id);
    }

    @Override
    @Transactional
    public Contact findById(Integer id) {
        return contactDAO.findById(id);
    }

    @Override
    @Transactional
    public void save(Contact contact){
        contactDAO.save(contact);
    }
}
