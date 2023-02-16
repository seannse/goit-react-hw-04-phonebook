import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { ContactForm, ContactList, Filter } from './components';

export function App() {
  const [contacts, setContacts] = useState(
    () => localStorage.setItem('contacts', JSON.stringify(contacts)) ?? []
  );
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contactsFromLocalStorage = JSON.parse(
      localStorage.getItem('contacts')
    );
    contactsFromLocalStorage && setContacts(contactsFromLocalStorage);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem('contacts', JSON.stringify(contacts));
  // }, [contacts]);

  function addContact(contactObj) {
    if (
      contacts.some(
        ({ name }) =>
          name.toLowerCase().trim() === contactObj.name.toLowerCase().trim()
      )
    ) {
      Notify.failure(`${contactObj.name} is already in contacts!`);
      return;
    }
    setContacts(prevContacts => [
      ...prevContacts,
      {
        id: nanoid(),
        ...contactObj,
      },
    ]);
  }

  function handleFilter({ target }) {
    setFilter(target.value);
  }

  function filteredContacts() {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  function handleDelete(id) {
    setContacts(contacts.filter(contact => contact.id !== id));
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm addContact={addContact} />
      <Filter handleFilter={handleFilter} value={filter} />
      <h2>Contacts</h2>
      {contacts.length !== 0 ? (
        <ContactList
          handleDelete={handleDelete}
          contactArr={filteredContacts()}
        />
      ) : (
        <p>Your contacts list is empty</p>
      )}
    </div>
  );
}
