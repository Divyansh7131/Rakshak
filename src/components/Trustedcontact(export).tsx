import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Contacts from "expo-contacts";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface DeviceContact {
  id: string;
  name: string;
  phoneNumbers?: Array<{ number?: string }>;
}

export default function TrustedContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);
  const [showContactList, setShowContactList] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const API_BASE = "https://rakshak-gamma.vercel.app/api/user";

  //  Load userId from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("loggedInUser");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserId(parsed.id);
        } else {
          Alert.alert("Error", "User not found in storage.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Storage error:", err);
        Alert.alert("Error", "Failed to read user data.");
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  //  Fetch user's trusted contacts
  useEffect(() => {
    if (!userId) return;
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${userId}/trusted-friends`);
        const data = await res.json();
        if (data.success) {
          setContacts(data.friends || []);
        } else {
          Alert.alert("Error", data.message || "Failed to fetch contacts.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        Alert.alert("Error", "Could not fetch contacts.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [userId]);

  //  Validate phone number (10 digits)
  const isValidPhoneNumber = (phone: string) => /^[0-9]{10}$/.test(phone);

  //  Add new trusted contact
  const addContact = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert("Invalid Input", "Please enter both name and phone number.");
      return;
    }
    if (!isValidPhoneNumber(newPhone)) {
      Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), phone: newPhone.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setContacts((prev) => [...prev, data.friend]);
        setNewName("");
        setNewPhone("");
        Alert.alert("Success", "Contact added successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to add contact.");
      }
    } catch (err) {
      console.error("Add contact error:", err);
      Alert.alert("Error", "Could not add contact.");
    }
  };

  //  Load contacts from device
  const loadDeviceContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot access contacts.");
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const filtered = data.filter((c) => c.phoneNumbers?.length);
      setDeviceContacts(filtered);
      setShowContactList(true);
    } catch (err) {
      console.error("Load contacts error:", err);
      Alert.alert("Error", "Could not load contacts.");
    }
  };

  // Handle contact selection from device
  const handleContactSelect = async (contact: DeviceContact) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    // Check if already added
    const alreadyAdded = contacts.find(
      (c) => c.name === contact.name || c.phone === contact.phoneNumbers?.[0]?.number?.replace(/\D/g, "").slice(-10)
    );

    if (alreadyAdded) {
      Alert.alert("Already Added", "This contact is already in your trusted list.");
      setShowContactList(false);
      return;
    }

    const name = contact.name || "Unknown";
    const phone = contact.phoneNumbers?.[0]?.number?.replace(/\D/g, "").slice(-10) || "";

    if (!phone || !isValidPhoneNumber(phone)) {
      Alert.alert("Invalid Phone", "This contact has no valid 10-digit phone number.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (data.success) {
        setContacts((prev) => [...prev, data.friend]);
        Alert.alert("Success", `${name} added to trusted contacts!`);
      } else {
        Alert.alert("Error", data.message || "Failed to add contact.");
      }
    } catch (err) {
      console.error("Add contact error:", err);
      Alert.alert("Error", "Could not add contact.");
    }

    setShowContactList(false);
  };

  // ✅ Export trusted contacts to device
  // const exportContacts = async () => {
  //   if (contacts.length === 0) {
  //     Alert.alert("No Contacts", "No contacts to export.");
  //     return;
  //   }

  //   try {
  //     const { status } = await Contacts.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission Denied", "Cannot export contacts.");
  //       return;
  //     }

  //     let successCount = 0;
  //     for (const c of contacts) {
  //       try {
  //         await Contacts.addContactAsync({
  //           name: c.name,
  //           phoneNumbers: [{ label: "mobile", number: c.phone }],
  //         });
  //         successCount++;
  //       } catch (contactErr) {
  //         console.error(`Failed to export ${c.name}:`, contactErr);
  //       }
  //     }

  //     Alert.alert("Success", `${successCount} contact(s) exported to phone!`);
  //   } catch (err) {
  //     console.error("Export contacts error:", err);
  //     Alert.alert("Error", "Could not export contacts.");
  //   }
  // };

  //  Edit contact
  const startEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditModalVisible(true);
  };

  const saveEditContact = async () => {
    if (!editingContact || !userId) return;
    if (!editName.trim() || !editPhone.trim()) {
      Alert.alert("Invalid Input", "Please enter both name and phone number.");
      return;
    }
    if (!isValidPhoneNumber(editPhone)) {
      Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/${userId}/trusted-friends/${editingContact.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName.trim(),
            phone: editPhone.trim(),
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setContacts((prev) =>
          prev.map((c) =>
            c.id === editingContact.id ? { ...c, name: editName.trim(), phone: editPhone.trim() } : c
          )
        );
        setEditModalVisible(false);
        setEditingContact(null);
        Alert.alert("Success", "Contact updated successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to update contact.");
      }
    } catch (err) {
      console.error("Edit contact error:", err);
      Alert.alert("Error", "Could not update contact.");
    }
  };

  //  Delete contact
  const deleteContact = async (friendId: string) => {
    if (!userId) return;

    Alert.alert("Confirm Delete", "Are you sure you want to remove this contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${API_BASE}/${userId}/trusted-friends/${friendId}`,
              { method: "DELETE" }
            );

            if (res.ok) {
              setContacts((prev) => prev.filter((c) => c.id !== friendId));
              Alert.alert("Success", "Contact deleted successfully!");
            } else {
              const data = await res.json();
              Alert.alert("Error", data.message || "Failed to delete contact.");
            }
          } catch (err) {
            console.error("Delete error:", err);
            Alert.alert("Error", "Could not delete contact.");
          }
        },
      },
    ]);
  };

  // Render trusted contact item
  const renderTrustedContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactText}>
        {item.name} ({item.phone})
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => startEditContact(item)}>
          <Icon name="edit" type="material" color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteContact(item.id)}>
          <Icon name="delete" type="material" color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render device contact item
  const renderDeviceContact = ({ item }: { item: DeviceContact }) => (
    <TouchableOpacity style={styles.deviceContactItem} onPress={() => handleContactSelect(item)}>
      <Text style={styles.deviceContactName}>{item.name}</Text>
      <Text style={styles.deviceContactPhone}>{item.phoneNumbers?.[0]?.number}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          placeholderTextColor="#999"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={newPhone}
          onChangeText={setNewPhone}
          maxLength={10}
        />

        {/* Add Contact Manually */}
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Icon name="add" color="#fff" />
        </TouchableOpacity>

        {/* Select from Device Contacts */}
        <TouchableOpacity
          style={[styles.addButton, styles.blueButton]}
          onPress={loadDeviceContacts}
        >
          <Icon name="contacts" color="#fff" />
        </TouchableOpacity>

        {/* Export to Device Contacts */}
        {/* <TouchableOpacity
          style={[styles.addButton, styles.greenButton]}
          onPress={exportContacts}
        >
          <Icon name="upload" color="#fff" />
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderTrustedContact}
        ListEmptyComponent={<Text style={styles.emptyText}>No contacts added yet.</Text>}
        contentContainerStyle={contacts.length === 0 ? styles.emptyContainer : undefined}
      />

      {/* Device Contacts Modal */}
      <Modal visible={showContactList} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.contactListContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📇 Select Contact</Text>
              <TouchableOpacity onPress={() => setShowContactList(false)}>
                <Icon name="close" type="material" color="#FF0000" size={30} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={deviceContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderDeviceContact}
              ListEmptyComponent={<Text style={styles.emptyText}>No contacts found.</Text>}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              placeholderTextColor="#999"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={editPhone}
              onChangeText={setEditPhone}
              maxLength={10}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={saveEditContact}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 13,
    marginTop: 50,
    marginBottom: 50,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 50,
    marginBottom: 20,
    color: "#FF0000",
  },
  inputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FF0000",
    borderRadius: 5,
    padding: 10,
    width: 160,
    backgroundColor: "#FFFFFF",
    color: "#FF0000",
  },
  addButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  blueButton: {
    backgroundColor: "#007BFF",
  },
  greenButton: {
    backgroundColor: "#28A745",
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    width: 280,
  },
  contactText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  deviceContactItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  deviceContactName: {
    fontSize: 16,
    color: "#000",
  },
  deviceContactPhone: {
    color: "#555",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#888888",
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FF0000",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contactListContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: "#FF0000",
    borderRadius: 5,
    padding: 10,
    width: 100,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
    width: 100,
    alignItems: "center",
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});