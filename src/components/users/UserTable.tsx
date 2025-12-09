import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, XCircle } from "lucide-react";
import { User } from './userType';

interface UserTableProps {
  users: User[];
  onViewUser: (user: User) => void;
  onBlockUser: (user: User) => void;
}

export default function UserTable({ users, onViewUser, onBlockUser }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className='p-0'>
        <TableHeader className='h-16'>
          <TableRow className="bg-green-50 p-0 hover:bg-green-50 border-b border-gray-200">
            <TableHead className="font-semibold text-gray-700 text-xs">#SL</TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Account Number
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">Name</TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">Role</TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">Email</TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Date of Birth
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Phone Number
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Location
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Join Date, Time
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-xs">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              className="hover:bg-gray-50 h-16 border-b border-gray-100 last:border-0"
            >
              <TableCell className="text-sm text-gray-600">{index + 1}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {user.accountNumber}
              </TableCell>
              <TableCell className="text-sm text-gray-900 font-medium">
                {user.name}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'Organizer' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'Attendee' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
              <TableCell className="text-sm text-gray-600">{user.dob}</TableCell>
              <TableCell className="text-sm text-gray-600">{user.phone}</TableCell>
              <TableCell className="text-sm text-gray-600">{user.location}</TableCell>
              <TableCell className="text-sm text-gray-600">{user.joinDate}</TableCell>
              <TableCell className="text-sm text-gray-600">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => onViewUser(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={() => onBlockUser(user)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}