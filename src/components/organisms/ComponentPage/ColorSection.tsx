import clsx from 'clsx';
import ButtonLink from '@/components/molecules/links/ButtonLink'
type Color = (typeof colorList)[number];

export const ColorSection = ({ color, setColor, mode, toggleMode, textColor }: any) => {
    return (
        <li className='space-y-2'>
            <h2 className='text-lg md:text-xl'>Customize Colors</h2>
            <p className={clsx('mt-1! text-sm', textColor)}>
                You can change primary color to any Tailwind CSS colors. See
                globals.css to change your color.
            </p>
            <div className='flex flex-wrap gap-2'>
                <select
                    name='color'
                    id='color'
                    value={color}
                    className={clsx(
                        'block max-w-xs rounded-sm border',
                        mode === 'dark'
                            ? 'bg-dark border-gray-600'
                            : 'border-gray-300 bg-white',
                        'focus:border-primary-400 focus:ring-primary-400 focus:outline-hidden focus:ring-3'
                    )}
                    onChange={(e) => setColor(e.target.value as Color)}
                >
                    {colorList.map((c: any) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <ButtonLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/blob/main/src/styles/colors.css'>
                    Check list of colors
                </ButtonLink>
            </div>
            <div className='flex flex-wrap gap-2 text-xs font-medium'>
                <div className='bg-primary-50 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    50
                </div>
                <div className='bg-primary-100 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    100
                </div>
                <div className='bg-primary-200 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    200
                </div>
                <div className='bg-primary-300 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    300
                </div>
                <div className='bg-primary-400 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    400
                </div>
                <div className='bg-primary-500 flex h-10 w-10 items-center justify-center rounded-sm text-black'>
                    500
                </div>
                <div className='bg-primary-600 flex h-10 w-10 items-center justify-center rounded-sm text-white'>
                    600
                </div>
                <div className='bg-primary-700 flex h-10 w-10 items-center justify-center rounded-sm text-white'>
                    700
                </div>
                <div className='bg-primary-800 flex h-10 w-10 items-center justify-center rounded-sm text-white'>
                    800
                </div>
                <div className='bg-primary-900 flex h-10 w-10 items-center justify-center rounded-sm text-white'>
                    900
                </div>
                <div className='bg-primary-950 flex h-10 w-10 items-center justify-center rounded-sm text-white'>
                    950
                </div>
            </div>
        </li>
    )
}

const colorList = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
] as const;