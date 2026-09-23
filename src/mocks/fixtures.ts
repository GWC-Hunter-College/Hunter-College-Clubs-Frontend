import type { Club } from '../types/club';
import type { Event } from '../types/events';

export type DesignClub = Club & { verified: boolean; thumbnailUrl?: string };
export type DesignEvent = Event & { description: string };

// GWC (id 1) comes from public/data/demo-club.json. All descriptions are demo copy.
// memberCount is only set on a few clubs on purpose, to exercise the "only render {n} MEMBERS
// when present" degrade-cleanly rule from the README.
export const additionalClubs: DesignClub[] = [
  { id: 2, name: 'Computer Science Club', verified: true, memberCount: 88,
    description: 'Build projects, practice technical interviews, and meet other Hunter students who love computing. Our weekly study jams welcome every experience level.',
    tags: ['Technology', 'Career', 'Academic'] },
  { id: 3, name: 'Studio Arts Collective', logo: '/hero.png', verified: true, memberCount: 41,
    description: 'A space for student artists to sketch, share works in progress, and organize campus exhibitions. Join our open studios and collaborative workshops.',
    tags: ['Arts', 'Creative', 'Community'] },
  { id: 4, name: 'Culinary Society', logo: '/card.png', verified: true,
    description: 'Explore recipes and food traditions with fellow students. We host beginner cooking workshops, recipe exchanges, and community potlucks.',
    tags: ['Culture', 'Food', 'Social'] },
  { id: 5, name: 'Robotics Club', verified: true,
    description: 'Design, program, and test small robots with a student team. Bring your curiosity to hands-on build sessions and friendly engineering challenges.',
    tags: ['Engineering', 'Technology'] },
  { id: 6, name: 'Chess Club', logo: '/logo.png', verified: true,
    description: 'Drop in for casual games, learn opening strategies, and take part in friendly campus tournaments. Beginners and experienced players are welcome.',
    tags: ['Games', 'Social'] },
  { id: 7, name: 'Climate Action Network', logo: '/hero.png', verified: true,
    description: 'Connect with students working toward a more sustainable campus through neighborhood cleanups, practical workshops, and community conversations.',
    tags: ['Service', 'Environment'] },
  { id: 8, name: 'Film Appreciation Society', logo: '/ra.png', verified: true,
    description: 'Watch and discuss films from around the world. Our student-led screenings pair thoughtful conversation with a welcoming place to meet new people.',
    tags: ['Film', 'Arts', 'Culture'] },
  { id: 9, name: 'Demo Club Awaiting Verification', logo: '/logo.png', verified: false,
    description: 'A demo club awaiting verification, included to exercise the directory filter.',
    tags: ['Community'] },
];

export const additionalEvents: Array<{
  id: number; title: string; location: string; clubId: number; flyer?: string; days: number; durationHours: number;
  description: string; status?: 'posted' | 'cancelled'; images?: string[];
}> = [
  { id: 13, title: 'Girls Who Code — Club Fair', location: 'Hunter West Lobby', clubId: 1, flyer: '/ra.png', days: 3, durationHours: 26,
    description: 'Meet the Girls Who Code team, explore student projects, and find out about upcoming workshops and mentorship opportunities. All majors are welcome.',
    images: ['/card.png', '/hero.png'] },
  { id: 14, title: 'Robotics Open Build Lab', location: 'Hunter North, Lab 204', clubId: 5, flyer: undefined, days: 5, durationHours: 2,
    description: 'Work with a small team to assemble and program a tabletop robot. Materials are provided; no previous robotics experience is needed.' },
  { id: 15, title: 'Chess and Conversation', location: 'Student Lounge, Hunter West', clubId: 6, flyer: '/card.png', days: 7, durationHours: 2,
    description: 'Join casual chess games and meet other players. Club volunteers will help new players learn the rules and practice their first strategies.' },
  { id: 16, title: 'Student Sketchbook Exchange', location: 'Hunter North, Studio 301', clubId: 3, flyer: '/hero.png', days: -7, durationHours: 2,
    description: 'Students shared recent sketches and explored collaborative drawing prompts at this relaxed open studio session.', images: ['/card.png'] },
  { id: 17, title: 'Campus Sustainability Walk', location: 'Meet at Hunter West Entrance', clubId: 7, flyer: '/hero.png', days: 12, durationHours: 2,
    description: 'Explore campus sustainability projects and share ideas for the semester. Wear comfortable shoes and bring a reusable water bottle.', status: 'cancelled' },
  // Past events reaching back across earlier semesters, so the Club page's "past events" list
  // has more than one semester group to show (and a "load earlier" semester to reveal).
  { id: 20, title: 'Spring Kickoff Social', location: 'Hunter West Lobby', clubId: 1, flyer: '/card.png', days: -200, durationHours: 2,
    description: 'Members met to plan the semester and welcome new faces to Girls Who Code.', images: ['/hero.png'] },
  { id: 21, title: 'Summer Hack Jam', location: 'Hunter North, Room 304', clubId: 2, flyer: '/ra.png', days: -100, durationHours: 3,
    description: 'A summer build session where members shipped small projects together.' },
  { id: 22, title: 'Fall Welcome Mixer', location: 'Student Lounge, Hunter West', clubId: 1, flyer: '/card.png', days: -380, durationHours: 2,
    description: 'An icebreaker night for new and returning Girls Who Code members at the start of the year.' },
];

/** Draft events: only visible to that club's managers (step-1 drafts panel, Manage tab). */
export const draftEvents: Array<{ id: number; title: string; location: string; clubId: number; flyer?: string; days: number; durationHours: number; description: string }> = [
  { id: 30, title: 'Hack Night', location: 'Hunter North, Lab 204', clubId: 1, flyer: undefined, days: 20, durationHours: 4,
    description: 'An overnight build session for Girls Who Code members working on personal or team projects.' },
  { id: 31, title: 'Portfolio Night', location: 'Hunter North, Studio 301', clubId: 3, flyer: '/hero.png', days: 25, durationHours: 3,
    description: 'Studio Arts members present current work for peer feedback ahead of the semester show.' },
];
