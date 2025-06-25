package com.kadimar.erp;

import com.kadimar.erp.model.Contact;
import com.kadimar.erp.model.ContactCategory;
import com.kadimar.erp.model.ContactStatus;
import com.kadimar.erp.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ContactRepository contactRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting data initialization...");
        
        // Check if data already exists
        if (contactRepository.count() > 0) {
            System.out.println("Data already exists, skipping initialization.");
            return;
        }

        initializeContacts();
        
        System.out.println("Data initialization completed successfully!");
    }

    private void initializeContacts() {
        System.out.println("Initializing contacts...");
        
        Contact contact1 = new Contact();
        contact1.setName("John Smith");
        contact1.setEmail("john.smith@acme.com");
        contact1.setPhone("+1-555-0101");
        contact1.setCompany("Acme Corp");
        contact1.setPosition("CEO");
        contact1.setCategory(ContactCategory.CLIENT);
        contact1.setSource("Website");
        contact1.setStatus(ContactStatus.ACTIVE);
        contact1.setNotes("Key decision maker for enterprise solutions");
        
        Contact contact2 = new Contact();
        contact2.setName("Sarah Johnson");
        contact2.setEmail("sarah.j@techstart.com");
        contact2.setPhone("+1-555-0102");
        contact2.setCompany("TechStart Inc");
        contact2.setPosition("CTO");
        contact2.setCategory(ContactCategory.PROSPECT);
        contact2.setSource("Referral");
        contact2.setStatus(ContactStatus.ACTIVE);
        contact2.setNotes("Technical lead, interested in our API solutions");
        
        Contact contact3 = new Contact();
        contact3.setName("Michael Chen");
        contact3.setEmail("m.chen@innovate.com");
        contact3.setPhone("+1-555-0103");
        contact3.setCompany("Innovate Solutions");
        contact3.setPosition("Product Manager");
        contact3.setCategory(ContactCategory.PROSPECT);
        contact3.setSource("Cold Call");
        contact3.setStatus(ContactStatus.ACTIVE);
        contact3.setNotes("Looking for integration capabilities");
        
        contactRepository.save(contact1);
        contactRepository.save(contact2);
        contactRepository.save(contact3);
        
        System.out.println("Contacts initialized: 3");
    }
}