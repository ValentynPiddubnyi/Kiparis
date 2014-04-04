package com.piddubnyi.kiparis.service;

import com.piddubnyi.kiparis.model.Contact;

import java.util.List;

/**
 * Created by fil on 3/13/14.
 */
public interface ContactService {

    public void addContact(Contact contact);
    public List<Contact> listContact();
    public void removeContact(Integer id);
    public Contact save(Contact contact);
    public Contact findById(Integer id);
}
