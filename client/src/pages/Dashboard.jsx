import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '../components/ui/Input';
import { useToast } from '@chakra-ui/react';
import { 
    Button, Divider, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay 
} from '@chakra-ui/react';

const Dashboard = () => {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const btnRef = React.useRef();
    const cancelRef = React.useRef();
    
    const [deleteRecordId, setDeleteRecordId] = useState(null);
    const [editRecordId, setEditRecordId] = useState(null);
    const [hours, setHours] = useState(1);
    const [date, setDate] = useState('');
    const [editHours, setEditHours] = useState(1);
    const [editDate, setEditDate] = useState('');
    const [userId, setUserId] = useState(localStorage.getItem('userId'));
    const [sleepRecords, setSleepRecords] = useState([]);
    const toast = useToast();

    const handleChange = (e, setter, isNumber = false) => {
        let value = e.target.value;
        if (isNumber) {
            value = Number(value);
        }
        setter(value);
    };

    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    };

    async function handleCreate(e) {
        e.preventDefault();
        try {
            const res = await axios.post("https://sleep-tracker-six.vercel.app/api/sleep", { hours, timestamp: date }, config);
            toast({ title: 'Sleep Duration Created!', status: 'success', duration: 6000, isClosable: true });
            setSleepRecords([...sleepRecords, res.data]);
            onCreateClose();
        } catch (err) {
            toast({ title: 'Error!', status: 'error', duration: 6000, isClosable: true });
        }
    }

    async function handleDelete() {
        try {
            await axios.delete(`https://sleep-tracker-six.vercel.app/api/sleep/${deleteRecordId}`, config);
            setSleepRecords(sleepRecords.filter(record => record._id !== deleteRecordId));
            onAlertClose();
            toast({ title: 'Sleep Record Deleted!', status: 'success', duration: 6000, isClosable: true });
        } catch (err) {
            toast({ title: 'Error!', status: 'error', duration: 6000, isClosable: true });
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            const res = await axios.put(`https://sleep-tracker-six.vercel.app/api/sleep/${editRecordId}`, { hours: editHours, timestamp: editDate }, config);
            setSleepRecords(sleepRecords.map(record => record._id === editRecordId ? res.data : record));
            toast({ title: 'Sleep Record Updated!', status: 'success', duration: 6000, isClosable: true });
            onEditClose();
        } catch (err) {
            toast({ title: 'Error!', status: 'error', duration: 6000, isClosable: true });
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`hhttps://sleep-tracker-six.vercel.app/api/sleep/${userId}`, config);
                setSleepRecords(res.data);
            } catch (err) {
                console.log(err.response.data);
            }
        }
        fetchData();
    }, [userId]);

    return (
        <div className='bg-black h-full text-white pb-5'>
            <div className='flex justify-end w-screen'>
                <Button ref={btnRef} colorScheme='blue' m={4} onClick={onCreateOpen}>
                    Create Sleep Duration
                </Button>
            </div>
            <Divider />
            <div>
                <Drawer isOpen={isCreateOpen} placement='right' onClose={onCreateClose} finalFocusRef={btnRef}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Create</DrawerHeader>
                            <form onSubmit={handleCreate}>
                                <DrawerBody>
                                    <Input type={"number"} label={"Hours"} placeholder={"Enter the no. of hours you slept!"} 
                                        onChange={(e) => handleChange(e, setHours, true)} />
                                    <Input type={"text"} label={"Date"} placeholder={"(2023-05-17T07:00:00.000+00:00)"} 
                                        onChange={(e) => handleChange(e, setDate)} />
                                </DrawerBody>
                                <Button type='submit' colorScheme='blue' m={4}>Save</Button>
                            </form>
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
                
                <Drawer isOpen={isEditOpen} placement='right' onClose={onEditClose} finalFocusRef={btnRef}>
                    <DrawerOverlay>
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>Edit</DrawerHeader>
                            <form onSubmit={handleUpdate}>
                                <DrawerBody>
                                    <Input type={"number"} label={"Hours"} placeholder={"Enter the no. of hours you slept!"} 
                                        value={editHours} onChange={(e) => handleChange(e, setEditHours, true)} />
                                    <Input type={"text"} label={"Date"} placeholder={"Enter the timestamp"} 
                                        value={editDate} onChange={(e) => handleChange(e, setEditDate)} />
                                </DrawerBody>
                                <Button type='submit' colorScheme='blue' m={4}>Save</Button>
                            </form>
                        </DrawerContent>
                    </DrawerOverlay>
                </Drawer>
            </div>
            
            <div className='flex flex-col justify-center items-center text-white mt-4'>
                <div className=''>
                    <h1 className='font-semibold text-3xl'>Dashboard</h1>
                </div>
                <div className='mt-4 text-white'>
                    <h1 className='font-semibold text-xl'>Sleep Duration</h1>
                </div>
                <div className='text-white'>
                    <ul className='border rounded-md p-4 mt-4'>
                        {sleepRecords.map((record) => (
                            <li className='mt-5' key={record._id}>
                                <p>Hours: {record.hours}</p>
                                <p>Timestamp: {new Date(record.timestamp).toLocaleString()}</p>
                                <div className='flex gap-3'>
                                    <div>
                                        <Button size='sm' onClick={() => {
                                            setEditRecordId(record._id);
                                            setEditHours(record.hours);
                                            setEditDate(new Date(record.timestamp).toISOString().slice(0, 10)); // Adjust as needed
                                            onEditOpen();
                                        }}>Edit</Button>                                        
                                    </div>
                                    <div>
                                        <Button onClick={() => { setDeleteRecordId(record._id); onAlertOpen(); }} colorScheme='red' size='sm'>Delete</Button>
                                        <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={onAlertClose}>
                                            <AlertDialogOverlay>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>Delete Record</AlertDialogHeader>
                                                    <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>
                                                    <AlertDialogFooter>
                                                        <Button ref={cancelRef} onClick={onAlertClose}>Cancel</Button>
                                                        <Button colorScheme='red' onClick={handleDelete} ml={3}>Delete</Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialogOverlay>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
