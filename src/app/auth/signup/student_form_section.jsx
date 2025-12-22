import { Mail, Lock, LockOpen, Building2, ChevronDown, Users } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import validateForm from "@/functions/validate_form";
import {contextStore} from "@/app/auth/layout";

const fetchSchools = async (query, setData, setMessage) => {
    try {
        const res = await fetch(`/api/schools?q=${query}`);
        const data = await res.json();
        if (data.success) setData(data.data);
        else setMessage("School not found!");
    } catch (err) { console.error(err); }
};

const fetchGroups = async (school_id, query, setData, setMessage) => {
    if (!school_id) return;
    try {
        const res = await fetch(`/api/groups/${school_id}?q=${query}`);
        const data = await res.json();
        if (data.success) setData(data.data);
        else setMessage("Group not found!");
    } catch (err) { console.error(err); }
};

export default function StudentFormSection({ sign_up }) {
    const { sets: [setError] } = useContext(contextStore);

    const firstnameRef = useRef(null);
    const second_nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const schoolRef = useRef(null);
    const groupRef = useRef(null);

    const [show, setShow] = useState(false);
    const [locked, setLocked] = useState(true);
    const [schoolValue, setSchoolValue] = useState("");
    const [debouncedSchool, setDebouncedSchool] = useState("");
    const [groupValue, setGroupValue] = useState("");
    const [debouncedGroup, setDebouncedGroup] = useState("");
    const [schoolMessage, setSchoolMessage] = useState("");
    const [groupMessage, setGroupMessage] = useState("");
    const [schools, setSchools] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showGroups, setShowGroups] = useState(false);

    // Debounce school input
    useEffect(() => {
        if (schoolValue.length < 3) return;
        const id = setTimeout(() => {
            setDebouncedSchool(schoolValue);
            setSchoolMessage("");
        }, 500);
        return () => clearTimeout(id);
    }, [schoolValue]);

    // Fetch schools when debounced
    useEffect(() => {
        if (!debouncedSchool) return;
        fetchSchools(debouncedSchool, setSchools, setSchoolMessage);
    }, [debouncedSchool]);

    // Show/hide groups based on selected school
    useEffect(() => {
        const school = schools.find(s => s.school_name === schoolRef.current?.value.trim());
        if (school) {
            setShowGroups(true);
            fetchGroups(school.school_id, debouncedGroup, setGroups, setGroupMessage);
        } else {
            setShowGroups(false);
            setGroups([]);
            setGroupMessage("");
        }
    }, [schools, debouncedSchool]);

    // Debounce group input
    useEffect(() => {
        if (!showGroups || !groupValue || groupValue.length < 1) return;
        const id = setTimeout(() => {
            const school = schools.find(s => s.school_name === schoolRef.current?.value.trim());
            if (school) {
                fetchGroups(school.school_id, groupValue, setGroups, setGroupMessage);
                setGroupMessage("");
            }
        }, 500);
        return () => clearTimeout(id);
    }, [groupValue, showGroups, schools]);

    const handleSignUp = (e) => {
        e.preventDefault();
        const firstname = firstnameRef.current.value.trim() || null;
        const second_name = second_nameRef.current.value.trim() || null;
        const email = emailRef.current.value.trim() || null;
        const password = passwordRef.current.value.trim() || null;

        const school = schools.find(s => s.school_name === schoolRef.current?.value.trim());
        const school_id = school ? school.school_id : null;
        const group = groups.find(g => g.group_name === groupRef.current?.value.trim());
        const group_id = group ? group.group_id : null;

        const labels = ["First name", "Second name", "Email", "Password", "School", "Group"];
        const array = [firstname, second_name, email, password, school_id, group_id];

        const isValid = validateForm(labels, array, setError);
        if (isValid) sign_up({ firstname, second_name, email, password, school_id, group_id });
    };

    return (
        <>
            {/* First & Second name */}
            <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="firsname">Firstname</label>
                    <input ref={firstnameRef} id="firstname" type="text" autoComplete="off"
                           className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="secondname">Second name</label>
                    <input ref={second_nameRef} id="secondname" type="text" autoComplete="off"
                           className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2 mt-3">
                <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="email">Email Address</label>
                <div className="relative flex items-center">
                    <span className="absolute right-4 text-green-600"><Mail /></span>
                    <input ref={emailRef} id="email" type="email" autoComplete="off"
                           className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 mt-3">
                <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="password">Password</label>
                <div className="relative flex items-center">
                    <span onClick={() => setLocked(prev => !prev)} className="absolute right-4 text-green-600 cursor-pointer">
                        {locked ? <Lock /> : <LockOpen />}
                    </span>
                    <input ref={passwordRef} id="password" type={locked ? "password" : "text"} autoComplete="off"
                           className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                </div>
            </div>

            {/* School Information */}
            <div onClick={() => setShow(prev => !prev)} className="flex items-center justify-between cursor-pointer my-4">
                <div className="text-slate-700">School Information</div>
                <span className={`text-slate-700 transition-transform duration-300 ${show ? "rotate-180" : ""}`}>
                    <ChevronDown />
                </span>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-out px-1 py-5 ${show ? "max-h-fit opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}>
                <div className="flex flex-col gap-5">

                    {/* School input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="school_name">School name</label>
                        <div className="relative flex items-center">
                            <span className="absolute right-4 text-green-600"><Building2 /></span>
                            <input ref={schoolRef} list="schools" value={schoolValue} onChange={e => setSchoolValue(e.target.value)}
                                   id="school_name" type="text" autoComplete="off"
                                   className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                            <datalist id="schools">
                                {schools.map((school, index) => <option key={index} value={school.school_name} />)}
                            </datalist>
                        </div>
                        <p className="text-red-700 text-sm font-semibold ml-1">{schoolMessage}</p>
                    </div>

                    {/* Group input */}
                    <div className={`flex flex-col gap-2 transition-all duration-300 ease-out ${showGroups ? "max-h-fit opacity-100" : "max-h-0 opacity-0"}`}>
                        <label className="text-slate-700 text-sm font-semibold ml-1" htmlFor="group">Group</label>
                        <div className="relative flex items-center">
                            <span className="absolute right-4 text-green-600"><Users /></span>
                            <input ref={groupRef} list="groups" value={groupValue} onChange={e => setGroupValue(e.target.value)}
                                   id="group" type="text" autoComplete="off"
                                   className="w-full rounded-2xl py-3.5 pl-5 pr-4 text-white/70 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-primary transition-all duration-500 ease-out"/>
                            <datalist id="groups">
                                {groups.map((group, index) => <option key={index} value={group.group_name} />)}
                            </datalist>
                        </div>
                        <p className="text-red-700 text-sm font-semibold ml-1">{groupMessage}</p>
                    </div>

                </div>
            </div>

            <button className="mt-2 flex w-full cursor-pointer items-center justify-center
                    rounded-full bg-primary h-12 px-6 text-[#102217] text-base font-bold tracking-wide
                    hover:bg-[#20d86a] hover:shadow-lg hover:shadow-primary/20 transition-all
                    duration-500 ease-in-out active:scale-[0.98]"
                    onClick={handleSignUp}>
                Sign Up
            </button>
        </>
    );
}