package com.piddubnyi.kiparis.dao;

import com.piddubnyi.kiparis.model.Contact;

import java.util.List;

/**
 * Created by fil on 3/13/14.
 */
public interface ContactDAO {

    public void addContact(Contact contact);
    public List<Contact> listContact();
    public void removeContact(Integer id);
}
