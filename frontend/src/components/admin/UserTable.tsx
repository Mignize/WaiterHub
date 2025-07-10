import type { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-zinc-900 rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-zinc-800">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-zinc-800">
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 capitalize">{user.role}</td>
              <td className="py-2 px-4 flex gap-2">
                <button className="text-blue-400 hover:underline" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button className="text-red-400 hover:underline" onClick={() => onDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
